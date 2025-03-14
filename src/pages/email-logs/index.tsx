import React, { useEffect, useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	SortingState,
	getPaginationRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Trash2, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import config from '@/config'
import { format } from 'date-fns'
import { __ } from '@wordpress/i18n'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Badge } from '@/components/ui/badge'

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

interface EmailLogsResponse {
	status_code: number
	message?: string
	data: EmailLog[]
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
	const [data, setData] = useState<EmailLog[]>([])
	const [loading, setLoading] = useState(true)
	const [viewEmail, setViewEmail] = useState<EmailLog | null>(null)
	const [deleteEmail, setDeleteEmail] = useState<EmailLog | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

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
				setData(data.filter(email => email.id !== id))
				toast.success(responseData?.message || __('Email log deleted successfully', 'trigger'))
				console.log('delete response', responseData)
			} else {
				toast.error(responseData?.message || __('Failed to delete email log', 'trigger'))
			}
		} catch (error) {
			console.error('Error deleting email log:', error)
			toast.error(__('Failed to delete email log', 'trigger'))
		} finally {
			setIsDeleting(false)
			setDeleteEmail(null)
		}
	}

	const columns: ColumnDef<EmailLog>[] = [
		{
			accessorKey: 'id',
			header: __('ID', 'trigger'),
		},
		{
			accessorKey: 'mail_to',
			header: __('To', 'trigger'),
		},
		{
			accessorKey: 'mail_from',
			header: __('From', 'trigger'),
		},
		{
			accessorKey: 'subject',
			header: __('Subject', 'trigger'),
		},
		{
			accessorKey: 'message',
			header: __('Message', 'trigger'),
			cell: ({ row }) => {
				const message = row.getValue('message') as string
				return <div className="max-w-[500px] truncate">{message}</div>
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

	useEffect(() => {
		const fetchEmailLogs = async () => {
			try {
				const formData = new FormData();
				formData.append('action', 'trigger_fetch_email_logs');
				formData.append('trigger_nonce', config.nonce_value);

				const response = await fetch(config.ajax_url, {
					method: 'POST',
					body: formData,
				});

				const responseData = await response.json() as EmailLogsResponse;

				if (responseData.status_code === 200) {
					setData(responseData.data)
				}
			} catch (error) {
				console.error('Error fetching email logs:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchEmailLogs()
	}, [])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	})

	if (loading) {
		return <div>{__('Loading...', 'trigger')}</div>
	}

	return (
		<div className="p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">{__('Email Logs', 'trigger')}</h2>
				<Input
					placeholder={__('Filter subjects...', 'trigger')}
					value={(table.getColumn('subject')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('subject')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{__('No email logs found.', 'trigger')}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{__('Previous', 'trigger')}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{__('Next', 'trigger')}
				</Button>
			</div>

			{/* Updated View Email Dialog */}
			<Dialog open={!!viewEmail} onOpenChange={() => setViewEmail(null)}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<div className="flex items-start justify-between mb-6">
						<h2 className="text-xl font-semibold">{__('Email Log', 'trigger')}</h2>
						{/* <button
							onClick={() => setViewEmail(null)}
							className="text-gray-500 hover:text-gray-700"
						>
							<X className="h-5 w-5" />
						</button> */}
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
				title={__('Delete Email Log', 'trigger')}
				description={__('Are you sure you want to delete this email log? This action cannot be undone.', 'trigger')}
				icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
				variant="danger"
				confirmText={__('Delete', 'trigger')}
				cancelText={__('Cancel', 'trigger')}
				onConfirm={async () => {
					if (deleteEmail) {
						await handleDelete(deleteEmail.id)
					}
				}}
				loading={isDeleting}
				loadingText={__('Deleting...', 'trigger')}
			>
				{/* {deleteEmail && (
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
				)} */}
			</ConfirmationDialog>
		</div>
	)
}

export default EmailLogs