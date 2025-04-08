import React, { useEffect, useState } from 'react'
import { ColumnDef, SortingState, PaginationState, ColumnFiltersState, RowSelectionState } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Trash2, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react'
import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import config from '@/config'
import { format } from 'date-fns'
import { __ } from '@wordpress/i18n'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/data-table'
import { getProviderFullName } from '@/utils/utils'
interface EmailLog {
	id: number
	mail_to: string
	mail_from: string
	subject: string
	message: string
	created_at: string
	headers: string
	attachments: string
}

interface PaginationMeta {
	total: number
	per_page: number
	current_page: number
	total_pages: number
}

interface EmailLogsResponse {
	status_code: number
	message?: string
	data: {
		email_logs: EmailLog[]
		meta: PaginationMeta
	}
}

const CollapsibleSection = ({
	title,
	children,
	defaultOpen = false
}: {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="border rounded-lg">
			<button
				className="w-full px-4 py-3 flex items-center justify-between text-left font-medium hover:bg-gray-50"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{title}</span>
				{isOpen ? (
					<ChevronUp className="h-4 w-4 text-gray-500" />
				) : (
					<ChevronDown className="h-4 w-4 text-gray-500" />
				)}
			</button>
			{isOpen && (
				<div className="px-4 py-3 border-t">
					{children}
				</div>
			)}
		</div>
	);
};

const EmailLogs = () => {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	})
	const [data, setData] = useState<EmailLog[]>([])
	const [pageCount, setPageCount] = useState(0)
	const [loading, setLoading] = useState(true)
	const [viewEmail, setViewEmail] = useState<EmailLog | null>(null)
	const [deleteEmail, setDeleteEmail] = useState<EmailLog | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isBulkDeleting, setIsBulkDeleting] = useState(false)
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [searchQuery, setSearchQuery] = useState('')
	const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)

	const handleView = (email: EmailLog) => {
		setViewEmail(email)
	}

	const handleDelete = async (id: number) => {
		setIsDeleting(true)
		try {
			const formData = new FormData();
			formData.append('action', 'trigger_delete_email_log');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('id', id.toString());

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as EmailLogsResponse;

			if (responseData?.status_code === 200) {
				toast.success(responseData?.message || __('Email log deleted successfully', 'trigger'))
				await fetchEmailLogs({
					page: pageIndex + 1,
					per_page: pageSize,
					search: searchQuery,
				});
			} else {
				toast.error(responseData?.message || __('Failed to delete email log', 'trigger'))
			}
		} catch (error) {
			toast.error(__('Failed to delete email log', 'trigger'))
		} finally {
			setIsDeleting(false)
			setDeleteEmail(null)
		}
	}

	const handleBulkDelete = async () => {
		if (!deleteEmail) return;

		setIsBulkDeleting(true)
		try {
			const selectedIds = Object.keys(rowSelection).map(key => {
				return parseInt(key)
			}).filter(Boolean) as number[]

			const formData = new FormData();
			formData.append('action', 'trigger_bulk_delete_email_logs');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('ids', JSON.stringify(selectedIds));

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as EmailLogsResponse;

			if (responseData?.status_code === 200) {
				setRowSelection({})
				toast.success(__('Selected email logs deleted successfully', 'trigger'))
				await fetchEmailLogs({
					page: pageIndex + 1,
					per_page: pageSize,
					search: searchQuery,
				});
			} else {
				toast.error(responseData?.message || __('Failed to delete email logs', 'trigger'))
			}
		} catch (error) {
			toast.error(__('Failed to delete email logs', 'trigger'))
		} finally {
			setIsBulkDeleting(false)
			setDeleteEmail(null)
		}
	}

	const handleRowSelection = (rowIndex: number, checked: boolean, shiftKey: boolean) => {
		const row = data[rowIndex];
		if (!row) return;

		if (shiftKey && lastSelectedIndex !== null) {
			const start = Math.min(rowIndex, lastSelectedIndex);
			const end = Math.max(rowIndex, lastSelectedIndex);

			const newSelection = { ...rowSelection };
			for (let i = start; i <= end; i++) {
				const currentRow = data[i];
				if (currentRow) {
					newSelection[currentRow.id] = checked;
				}
			}
			setRowSelection(newSelection);
		} else {
			setRowSelection(prev => ({
				...prev,
				[row.id]: checked,
			}));
		}
		setLastSelectedIndex(rowIndex);
	};

	const columns: ColumnDef<EmailLog>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value)}
					aria-label={__('Select all', 'trigger')}
				/>
			),
			cell: ({ row, table }) => {
				const rowIndex = table.getRowModel().rows.findIndex(r => r.id === row.id);
				return (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(checked: boolean) => {
							const event = window.event as MouseEvent | undefined;
							handleRowSelection(rowIndex, checked, event?.shiftKey ?? false);
						}}
						aria-label={__('Select row', 'trigger')}
					/>
				);
			},
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'mail_to',
			header: __('To', 'trigger'),
		},
		{
			accessorKey: 'subject',
			header: __('Subject', 'trigger'),
		},
		{
			accessorKey: 'status',
			header: __('Status', 'trigger'),
			cell: ({ row }) => {
				const status = row.getValue('status') as string
				return <Badge variant="outline"
					className={`${status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
					{status === 'success' ? 'Successful' : 'Failed'}
				</Badge>
			},
		},
		{
			accessorKey: 'provider',
			header: __('Provider', 'trigger'),
			cell: ({ row }) => {
				const provider = row.getValue('provider') as string
				return getProviderFullName(provider);
			},
		},
		{
			accessorKey: 'created_at',
			header: __('Date', 'trigger'),
			cell: ({ row }) => {
				const date = new Date(row.getValue('created_at'))
				return format(date, 'PPpp')
			},
		},
		{
			id: 'actions',
			header: __('Actions', 'trigger'),
			cell: ({ row }) => {
				const email = row.original
				return (
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleView(email)}
							className="h-8 w-8 p-0"
						>
							<Eye className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setDeleteEmail(email)}
							className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				)
			},
		},
	]

	const fetchEmailLogs = async (params: { page: number; per_page: number; search?: string }) => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append('action', 'trigger_fetch_email_logs');
			formData.append('trigger_nonce', config.nonce_value);
			formData.append('page', params.page.toString());
			formData.append('per_page', params.per_page.toString());
			if (params.search) {
				formData.append('search', params.search);
			}

			const response = await fetch(config.ajax_url, {
				method: 'POST',
				body: formData,
			});

			const responseData = await response.json() as EmailLogsResponse;
			if (responseData.status_code === 200) {
				setData(responseData.data.email_logs)
				setPageCount(responseData.data.meta.total_pages)
			} else {
				toast.error(responseData?.message || __('Failed to fetch email logs', 'trigger'))
			}
		} catch (error) {
			toast.error(__('Failed to fetch email logs', 'trigger'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchEmailLogs({
			page: pageIndex + 1,
			per_page: pageSize,
			search: searchQuery,
		});
	}, [pageIndex, pageSize])

	const handleSearch = (value: string) => {
		setSearchQuery(value)
		setPagination(prev => ({ ...prev, pageIndex: 0 }))
		fetchEmailLogs({
			page: 1,
			per_page: pageSize,
			search: value,
		})
	}

	return (
		<div className="p-4 space-y-4">
			<h2 className="text-2xl font-bold">{__('Email Logs', 'trigger')}</h2>

			<DataTable<EmailLog>
				columns={columns}
				data={data}
				pageCount={pageCount}
				loading={loading}
				sorting={sorting}
				pagination={{ pageIndex, pageSize }}
				columnFilters={columnFilters}
				rowSelection={rowSelection}
				searchKey="subject"
				searchPlaceholder={__('Search by subject or email...', 'trigger')}
				onSearch={handleSearch}
				onPaginationChange={setPagination}
				onSortingChange={setSorting}
				onColumnFiltersChange={setColumnFilters}
				onRowSelectionChange={setRowSelection}
				onDeleteSelected={() => setDeleteEmail({ id: -1 } as EmailLog)}
				enableRowSelection
				enableSearch
				enablePagination
				getRowId={(row: EmailLog) => row.id.toString()}
			/>

			{/* View Email Dialog */}
			<Dialog open={!!viewEmail} onOpenChange={() => setViewEmail(null)}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<div className="flex items-start justify-between mb-6">
						<h2 className="text-xl font-semibold">{__('Email Log', 'trigger')}</h2>
					</div>

					{viewEmail && (
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<span className="text-gray-500">{__('Sent by:', 'trigger')}</span>
											<span>WordPress</span>
											<span className="text-gray-400">&lt;&gt;</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-gray-500">{__('Sent to:', 'trigger')}</span>
											<span>{viewEmail.mail_to}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-gray-500">{__('Subject:', 'trigger')}</span>
											<span>{viewEmail.subject}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-gray-500">{__('Retries:', 'trigger')}</span>
											<span>0</span>
										</div>
									</div>

									<div className="text-right space-y-2">
										<div className="flex justify-end gap-2">
											<Badge variant="outline">{__('Default', 'trigger')}</Badge>
											<Badge variant="success">{__('Successful', 'trigger')}</Badge>
										</div>
										<div className="text-gray-500">
											{format(new Date(viewEmail.created_at), 'MMM dd, yyyy, hh:mm a')}
										</div>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<CollapsibleSection title="Email Body" defaultOpen>
									<div
										className="prose max-w-none"
										dangerouslySetInnerHTML={{ __html: viewEmail.message }}
									/>
								</CollapsibleSection>

								<CollapsibleSection title="Email Headers">
									<div className="space-y-2">
										<div className="grid grid-cols-[100px_1fr] gap-2">
											<span className="text-gray-500">From:</span>
											<span>{viewEmail.mail_from}</span>
										</div>
										<div className="grid grid-cols-[100px_1fr] gap-2">
											<span className="text-gray-500">Reply-To:</span>
											<span></span>
										</div>
										<div className="grid grid-cols-[100px_1fr] gap-2">
											<span className="text-gray-500">CC:</span>
											<span></span>
										</div>
										<div className="grid grid-cols-[100px_1fr] gap-2">
											<span className="text-gray-500">BCC:</span>
											<span></span>
										</div>
										<div className="grid grid-cols-[100px_1fr] gap-2">
											<span className="text-gray-500">Content-Type:</span>
											<span>text/html; charset=UTF-8</span>
										</div>
										<div className="grid grid-cols-[100px_1fr] gap-2">
											<span className="text-gray-500">X-Mailer:</span>
											<span>WordPress/6.7.2</span>
										</div>
									</div>
								</CollapsibleSection>

								<CollapsibleSection title="Attachments (0)">
									<div className="text-gray-500 italic">
										{__('No attachments found.', 'trigger')}
									</div>
								</CollapsibleSection>

								<CollapsibleSection title="Server Response">
									<pre className="bg-gray-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap">
										{viewEmail.headers}
									</pre>
								</CollapsibleSection>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<ConfirmationDialog
				open={!!deleteEmail}
				onOpenChange={(open) => !open && setDeleteEmail(null)}
				title={deleteEmail?.id === -1 ? __('Delete Selected Email Logs', 'trigger') : __('Delete Email Log', 'trigger')}
				description={deleteEmail?.id === -1
					? __('Are you sure you want to delete all selected email logs? This action cannot be undone.', 'trigger')
					: __('Are you sure you want to delete this email log? This action cannot be undone.', 'trigger')
				}
				icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
				variant="danger"
				confirmText={__('Delete', 'trigger')}
				cancelText={__('Cancel', 'trigger')}
				onConfirm={async () => {
					if (deleteEmail) {
						if (deleteEmail.id === -1) {
							await handleBulkDelete()
						} else {
							await handleDelete(deleteEmail.id)
						}
					}
				}}
				loading={isDeleting || isBulkDeleting}
				loadingText={__('Deleting...', 'trigger')}
			>
				{deleteEmail && deleteEmail.id !== -1 && (
					<div className="space-y-2 mt-4">
						<div className="grid grid-cols-2 gap-2">
							<div>
								<span className="font-medium">{__('From:', 'trigger')}</span>
								<p className="text-sm text-muted-foreground">{deleteEmail.mail_from}</p>
							</div>
							<div>
								<span className="font-medium">{__('To:', 'trigger')}</span>
								<p className="text-sm text-muted-foreground">{deleteEmail.mail_to}</p>
							</div>
						</div>
						<div>
							<span className="font-medium">{__('Subject:', 'trigger')}</span>
							<p className="text-sm text-muted-foreground">{deleteEmail.subject}</p>
						</div>
					</div>
				)}
				{deleteEmail?.id === -1 && (
					<div className="mt-4">
						<p className="text-sm text-muted-foreground">
							{Object.keys(rowSelection).length} {__('email logs will be deleted.', 'trigger')}
						</p>
					</div>
				)}
			</ConfirmationDialog>
		</div>
	)
}

export default EmailLogs