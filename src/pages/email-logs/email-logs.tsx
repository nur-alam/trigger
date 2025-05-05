// import React, { useEffect, useState, useCallback, useRef } from 'react'
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from '@/components/ui/table'
// import {
// 	ColumnDef,
// 	flexRender,
// 	getCoreRowModel,
// 	useReactTable,
// 	getSortedRowModel,
// 	SortingState,
// 	PaginationState,
// 	ColumnFiltersState,
// 	getFilteredRowModel,
// 	RowSelectionState,
// } from '@tanstack/react-table'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Eye, Trash2, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react'
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// } from "@/components/ui/dialog"
// import { toast } from 'sonner'
// import config from '@/config'
// import { format } from 'date-fns'
// import { __ } from '@wordpress/i18n'
// import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
// import { Badge } from '@/components/ui/badge'
// import { Checkbox } from '@/components/ui/checkbox'
// import { debounce } from 'lodash'
// import {
// 	Pagination,
// 	PaginationContent,
// 	PaginationEllipsis,
// 	PaginationItem,
// 	PaginationLink,
// 	PaginationNext,
// 	PaginationPrevious,
// } from "@/components/ui/pagination"
// import { getProviderFullName } from '@/utils/utils'

// interface EmailLog {
// 	id: number
// 	mail_to: string
// 	mail_from: string
// 	subject: string
// 	message: string
// 	created_at: string
// 	headers: string
// 	attachments: string
// }

// interface PaginationMeta {
// 	total: number
// 	per_page: number
// 	current_page: number
// 	total_pages: number
// }

// interface EmailLogsResponse {
// 	status_code: number
// 	message?: string
// 	data: {
// 		email_logs: EmailLog[]
// 		meta: PaginationMeta
// 	}
// }

// const CollapsibleSection = ({
// 	title,
// 	children,
// 	defaultOpen = false
// }: {
// 	title: string;
// 	children: React.ReactNode;
// 	defaultOpen?: boolean;
// }) => {
// 	const [isOpen, setIsOpen] = useState(defaultOpen);

// 	return (
// 		<div className="border rounded-lg">
// 			<button
// 				className="w-full px-4 py-3 flex items-center justify-between text-left font-medium hover:bg-gray-50"
// 				onClick={() => setIsOpen(!isOpen)}
// 			>
// 				<span>{title}</span>
// 				{isOpen ? (
// 					<ChevronUp className="h-4 w-4 text-gray-500" />
// 				) : (
// 					<ChevronDown className="h-4 w-4 text-gray-500" />
// 				)}
// 			</button>
// 			{isOpen && (
// 				<div className="px-4 py-3 border-t">
// 					{children}
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// const TableSkeleton = () => (
// 	<TableBody>
// 		{Array.from({ length: 5 }).map((_, i) => (
// 			<TableRow key={i}>
// 				{Array.from({ length: 7 }).map((_, j) => (
// 					<TableCell key={j}>
// 						<div className="h-6 w-full animate-pulse rounded bg-gray-200" />
// 					</TableCell>
// 				))}
// 			</TableRow>
// 		))}
// 	</TableBody>
// )

// const EmailLogs = () => {
// 	const [sorting, setSorting] = useState<SortingState>([])
// 	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
// 	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
// 		pageIndex: 0,
// 		pageSize: 5,
// 	})
// 	const [data, setData] = useState<EmailLog[]>([])
// 	const [pageCount, setPageCount] = useState(0)
// 	const [loading, setLoading] = useState(true)
// 	const [viewEmail, setViewEmail] = useState<EmailLog | null>(null)
// 	const [deleteEmail, setDeleteEmail] = useState<EmailLog | null>(null)
// 	const [isDeleting, setIsDeleting] = useState(false)
// 	const [isBulkDeleting, setIsBulkDeleting] = useState(false)
// 	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
// 	const lastSelectedRowRef = useRef<number | null>(null)
// 	const [searchQuery, setSearchQuery] = useState('');
// 	const debouncedSearch = useCallback(
// 		debounce((value: string) => {
// 			setPagination((prev) => ({ ...prev, pageIndex: 0 }));
// 			fetchEmailLogs({
// 				page: 1,
// 				per_page: pageSize,
// 				search: value,
// 			});
// 		}, 500),
// 		[pageSize]
// 	);

// 	const pagination = React.useMemo(
// 		() => ({
// 			pageIndex,
// 			pageSize,
// 		}),
// 		[pageIndex, pageSize]
// 	)

// 	const handleView = (email: EmailLog) => {
// 		setViewEmail(email)
// 	}

// 	const handleDelete = async (id: number) => {
// 		setIsDeleting(true)
// 		try {
// 			const formData = new FormData();
// 			formData.append('action', 'trigger_delete_email_log');
// 			formData.append('trigger_nonce', config.nonce_value);
// 			formData.append('id', id.toString());

// 			const response = await fetch(config.ajax_url, {
// 				method: 'POST',
// 				body: formData,
// 			});

// 			const responseData = await response.json() as EmailLogsResponse;

// 			if (responseData?.status_code === 200) {
// 				setData(data.filter(email => email.id !== id))
// 				toast.success(responseData?.message || __('Email log deleted successfully', 'trigger'))
// 				console.log('delete response', responseData)
// 			} else {
// 				toast.error(responseData?.message || __('Failed to delete email log', 'trigger'))
// 			}
// 		} catch (error) {
// 			console.error('Error deleting email log:', error)
// 			toast.error(__('Failed to delete email log', 'trigger'))
// 		} finally {
// 			setIsDeleting(false)
// 			setDeleteEmail(null)
// 		}
// 	}

// 	const handleBulkDelete = async () => {
// 		setIsBulkDeleting(true)
// 		try {
// 			const selectedRows = table.getSelectedRowModel().rows
// 			const selectedIds = selectedRows.map(row => (row.original as EmailLog).id)

// 			const formData = new FormData();
// 			formData.append('action', 'trigger_bulk_delete_email_logs');
// 			formData.append('trigger_nonce', config.nonce_value);
// 			formData.append('ids', JSON.stringify(selectedIds));

// 			const response = await fetch(config.ajax_url, {
// 				method: 'POST',
// 				body: formData,
// 			});

// 			const responseData = await response.json() as EmailLogsResponse;

// 			if (responseData?.status_code === 200) {
// 				setData(data.filter(email => !selectedIds.includes(email.id)))
// 				setRowSelection({})
// 				toast.success(__('Selected email logs deleted successfully', 'trigger'))
// 			} else {
// 				toast.error(responseData?.message || __('Failed to delete email logs', 'trigger'))
// 			}
// 		} catch (error) {
// 			toast.error(__('Failed to delete email logs', 'trigger'))
// 		} finally {
// 			setIsBulkDeleting(false)
// 		}
// 	}

// 	const columns: ColumnDef<EmailLog>[] = [
// 		{
// 			id: 'select',
// 			header: ({ table }) => (
// 				<Checkbox
// 					checked={
// 						table.getIsAllPageRowsSelected() ||
// 						(table.getIsSomePageRowsSelected() && 'indeterminate')
// 					}
// 					onCheckedChange={(value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value)}
// 					aria-label={__('Select all', 'trigger')}
// 				/>
// 			),
// 			cell: ({ row }) => {
// 				const handleCheckboxClick = (e: React.MouseEvent) => {
// 					if (e.shiftKey && lastSelectedRowRef.current !== null) {
// 						const currentIndex = row.index
// 						const lastIndex = lastSelectedRowRef.current
// 						const start = Math.min(currentIndex, lastIndex)
// 						const end = Math.max(currentIndex, lastIndex)

// 						const newSelection = { ...rowSelection }
// 						// Get all rows between start and end
// 						const rows = table.getRowModel().rows
// 						rows.forEach((tableRow) => {
// 							if (tableRow.index >= start && tableRow.index <= end) {
// 								newSelection[tableRow.id] = true
// 							}
// 						})
// 						setRowSelection(newSelection)
// 					} else {
// 						row.toggleSelected()
// 						lastSelectedRowRef.current = row.index
// 					}
// 				}

// 				return (
// 					<Checkbox
// 						checked={row.getIsSelected()}
// 						onClick={handleCheckboxClick}
// 						onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
// 						aria-label={__('Select row', 'trigger')}
// 					/>
// 				)
// 			},
// 			enableSorting: false,
// 			enableHiding: false,
// 		},
// 		{
// 			accessorKey: 'id',
// 			header: __('ID', 'trigger'),
// 		},
// 		{
// 			accessorKey: 'mail_to',
// 			header: __('To', 'trigger'),
// 		},
// 		// {
// 		// 	accessorKey: 'mail_from',
// 		// 	header: __('From', 'trigger'),
// 		// },
// 		{
// 			accessorKey: 'subject',
// 			header: __('Subject', 'trigger'),
// 		},
// 		{
// 			accessorKey: 'provider',
// 			header: __('Provider', 'trigger'),
// 			cell: ({ row }) => {
// 				const provider = row.getValue('provider') as string
// 				return getProviderFullName(provider);
// 			},
// 		},
// 		// {
// 		// 	accessorKey: 'message',
// 		// 	header: __('Message', 'trigger'),
// 		// 	cell: ({ row }) => {
// 		// 		const message = row.getValue('message') as string
// 		// 		return <div className="max-w-[500px] truncate">{message}</div>
// 		// 	},
// 		// },
// 		{
// 			accessorKey: 'created_at',
// 			header: __('Date', 'trigger'),
// 			cell: ({ row }) => {
// 				const date = new Date(row.getValue('created_at'))
// 				return format(date, 'PPpp')
// 			},
// 		},
// 		{
// 			id: 'actions',
// 			header: __('Actions', 'trigger'),
// 			cell: ({ row }) => {
// 				const email = row.original
// 				return (
// 					<div className="flex items-center gap-2">
// 						<Button
// 							variant="ghost"
// 							size="icon"
// 							onClick={() => handleView(email)}
// 							className="h-8 w-8 p-0"
// 						>
// 							<Eye className="h-4 w-4" />
// 						</Button>
// 						<Button
// 							variant="ghost"
// 							size="icon"
// 							onClick={() => setDeleteEmail(email)}
// 							className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
// 						>
// 							<Trash2 className="h-4 w-4" />
// 						</Button>
// 					</div>
// 				)
// 			},
// 		},
// 	]

// 	const fetchEmailLogs = async (params: { page: number; per_page: number; search?: string }) => {
// 		setLoading(true);
// 		try {
// 			const formData = new FormData();
// 			formData.append('action', 'trigger_fetch_email_logs');
// 			formData.append('trigger_nonce', config.nonce_value);
// 			formData.append('page', params.page.toString());
// 			formData.append('per_page', params.per_page.toString());
// 			if (params.search) {
// 				formData.append('search', params.search);
// 			}

// 			const response = await fetch(config.ajax_url, {
// 				method: 'POST',
// 				body: formData,
// 			});

// 			const responseData = await response.json() as EmailLogsResponse;
// 			if (responseData.status_code === 200) {
// 				setData(responseData.data.email_logs)
// 				setPageCount(responseData.data.meta.total_pages)
// 			} else {
// 				toast.error(responseData?.message || __('Failed to fetch email logs', 'trigger'))
// 			}
// 		} catch (error) {
// 			toast.error(__('Failed to fetch email logs', 'trigger'))
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	useEffect(() => {
// 		fetchEmailLogs({
// 			page: pageIndex + 1,
// 			per_page: pageSize,
// 			search: searchQuery,
// 		});
// 	}, [pageIndex, pageSize])

// 	const table = useReactTable({
// 		data,
// 		columns,
// 		pageCount,
// 		state: {
// 			sorting,
// 			pagination,
// 			columnFilters,
// 			rowSelection,
// 		},
// 		enableRowSelection: true,
// 		onRowSelectionChange: setRowSelection,
// 		onPaginationChange: setPagination,
// 		onSortingChange: setSorting,
// 		getSortedRowModel: getSortedRowModel(),
// 		getCoreRowModel: getCoreRowModel(),
// 		onColumnFiltersChange: setColumnFilters,
// 		getFilteredRowModel: getFilteredRowModel(),
// 		manualPagination: true,
// 	})

// 	if (loading) {
// 		return (
// 			<div className="p-4 space-y-4">

// 				<div className="flex items-center justify-between h-12">
// 					<h2 className="text-2xl font-bold">{__('Email Logs', 'trigger')}</h2>
// 					<div className="flex items-center gap-4">
// 						{Object.keys(rowSelection).length > 0 ? (
// 							<div className="flex items-center gap-4">
// 								<span className="text-sm text-muted-foreground">
// 									{table.getFilteredSelectedRowModel().rows.length} {__('selected', 'trigger')}
// 								</span>
// 								<Button
// 									variant="destructive"
// 									size="sm"
// 									onClick={() => {
// 										setDeleteEmail({ id: -1 } as EmailLog)
// 									}}
// 									disabled={isBulkDeleting}
// 									className="flex items-center gap-2"
// 								>
// 									<Trash2 className="h-4 w-4" />
// 									{__('Delete Selected', 'trigger')}
// 								</Button>
// 							</div>
// 						) : (
// 							<Input
// 								placeholder={__('Search by subject or email...', 'trigger')}
// 								value={searchQuery}
// 								onChange={(event) => {
// 									setSearchQuery(event.target.value);
// 									debouncedSearch(event.target.value);
// 								}}
// 								className="w-[300px]"
// 							/>
// 						)}
// 					</div>
// 				</div>

// 				<div className="rounded-md border">
// 					<Table>
// 						<TableHeader>
// 							{table.getHeaderGroups().map((headerGroup) => (
// 								<TableRow key={headerGroup.id}>
// 									{headerGroup.headers.map((header) => (
// 										<TableHead key={header.id}>
// 											{header.isPlaceholder
// 												? null
// 												: flexRender(
// 													header.column.columnDef.header,
// 													header.getContext()
// 												)}
// 										</TableHead>
// 									))}
// 								</TableRow>
// 							))}
// 						</TableHeader>
// 						<TableSkeleton />
// 					</Table>
// 				</div>

// 				<div className="flex items-center justify-between space-x-2 py-4">
// 					<div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
// 					<div className="flex items-center space-x-6 lg:space-x-8">
// 						<div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
// 						<div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
// 						<div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}

// 	return (
// 		<div className="p-4 space-y-4">
// 			<div className="flex items-center justify-between h-12">
// 				<h2 className="text-2xl font-bold">{__('Email Logs', 'trigger')}</h2>
// 				<div className="flex items-center gap-4">
// 					{Object.keys(rowSelection).length > 0 ? (
// 						<div className="flex items-center gap-4">
// 							<span className="text-sm text-muted-foreground">
// 								{table.getFilteredSelectedRowModel().rows.length} {__('selected', 'trigger')}
// 							</span>
// 							<Button
// 								variant="destructive"
// 								size="sm"
// 								onClick={() => setDeleteEmail({ id: -1 } as EmailLog)}
// 								disabled={isBulkDeleting}
// 								className="flex items-center gap-2"
// 							>
// 								<Trash2 className="h-4 w-4" />
// 								{__('Delete Selected', 'trigger')}
// 							</Button>
// 						</div>
// 					) : (
// 						<Input
// 							placeholder={__('Search by subject or email...', 'trigger')}
// 							value={searchQuery}
// 							onChange={(event) => {
// 								const value = event.target.value;
// 								setSearchQuery(value);
// 								debouncedSearch(value);
// 							}}
// 							className="w-[300px]"
// 						/>
// 					)}
// 				</div>
// 			</div>

// 			<div className="rounded-md border">
// 				<Table>
// 					<TableHeader>
// 						{table.getHeaderGroups().map((headerGroup) => (
// 							<TableRow key={headerGroup.id}>
// 								{headerGroup.headers.map((header) => (
// 									<TableHead key={header.id}>
// 										{header.isPlaceholder
// 											? null
// 											: flexRender(
// 												header.column.columnDef.header,
// 												header.getContext()
// 											)}
// 									</TableHead>
// 								))}
// 							</TableRow>
// 						))}
// 					</TableHeader>
// 					{loading ? (
// 						<TableSkeleton />
// 					) : table.getRowModel().rows?.length ? (
// 						<TableBody>
// 							{table.getRowModel().rows.map((row) => (
// 								<TableRow
// 									key={row.id}
// 									data-state={row.getIsSelected() && 'selected'}
// 								>
// 									{row.getVisibleCells().map((cell) => (
// 										<TableCell key={cell.id}>
// 											{flexRender(
// 												cell.column.columnDef.cell,
// 												cell.getContext()
// 											)}
// 										</TableCell>
// 									))}
// 								</TableRow>
// 							))}
// 						</TableBody>
// 					) : (
// 						<TableBody>
// 							<TableRow>
// 								<TableCell
// 									colSpan={columns.length}
// 									className="h-24 text-center"
// 								>
// 									{__('No email logs found.', 'trigger')}
// 								</TableCell>
// 							</TableRow>
// 						</TableBody>
// 					)}
// 				</Table>
// 			</div>

// 			<div className="flex flex-wrap items-center justify-between space-x-2 py-4">
// 				<div className="flex-1 text-sm text-muted-foreground hidden lg:block">
// 					{table.getFilteredSelectedRowModel().rows.length} of{' '}
// 					{table.getFilteredRowModel().rows.length} row(s) selected.
// 				</div>
// 				<div className="flex-1 flex space-x-2 items-center justify-center">
// 					<p className="text-sm font-medium">
// 						{__('Rows per page', 'trigger')}
// 					</p>
// 					<select
// 						value={table.getState().pagination.pageSize}
// 						onChange={(e) => {
// 							table.setPageSize(Number(e.target.value))
// 						}}
// 						className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
// 					>
// 						{[10, 20, 30, 40, 50].map((pageSize) => (
// 							<option key={pageSize} value={pageSize}>
// 								{pageSize}
// 							</option>
// 						))}
// 					</select>
// 				</div>
// 				<Pagination className="flex-1 justify-end">
// 					<PaginationContent className="gap-2">
// 						<PaginationItem>
// 							<PaginationPrevious
// 								onClick={() => table.previousPage()}
// 								disabled={!table.getCanPreviousPage() || loading}
// 								aria-disabled={!table.getCanPreviousPage() || loading}
// 								className="h-8 min-w-8 px-2"
// 							/>
// 						</PaginationItem>
// 						{Array.from({ length: pageCount }, (_, i) => {
// 							const pageNumber = i + 1;
// 							const currentPage = table.getState().pagination.pageIndex + 1;

// 							if (
// 								pageNumber === 1 ||
// 								pageNumber === pageCount ||
// 								(pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
// 							) {
// 								return (
// 									<PaginationItem key={i}>
// 										<PaginationLink
// 											onClick={() => table.setPageIndex(i)}
// 											isActive={currentPage === pageNumber}
// 											className="h-8 min-w-8 px-3"
// 										>
// 											{pageNumber}
// 										</PaginationLink>
// 									</PaginationItem>
// 								);
// 							} else if (
// 								(pageNumber === 2 && currentPage > 3) ||
// 								(pageNumber === pageCount - 1 && currentPage < pageCount - 2)
// 							) {
// 								return (
// 									<PaginationItem key={i}>
// 										<PaginationEllipsis className="h-8" />
// 									</PaginationItem>
// 								);
// 							}
// 							return null;
// 						})}
// 						<PaginationItem>
// 							<PaginationNext
// 								onClick={() => table.nextPage()}
// 								disabled={!table.getCanNextPage() || loading}
// 								aria-disabled={!table.getCanNextPage() || loading}
// 								className="h-8 min-w-8 px-2"
// 							/>
// 						</PaginationItem>
// 					</PaginationContent>
// 				</Pagination>
// 				{/* <div className="flex items-center space-x-6 lg:space-x-8">
// 				</div> */}
// 			</div>

// 			{/* Updated View Email Dialog */}
// 			<Dialog open={!!viewEmail} onOpenChange={() => setViewEmail(null)}>
// 				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
// 					<div className="flex items-start justify-between mb-6">
// 						<h2 className="text-xl font-semibold">{__('Email Log', 'trigger')}</h2>
// 						{/* <button
// 							onClick={() => setViewEmail(null)}
// 							className="text-gray-500 hover:text-gray-700"
// 						>
// 							<X className="h-5 w-5" />
// 						</button> */}
// 					</div>

// 					{viewEmail && (
// 						<div className="space-y-6">
// 							<div className="space-y-4">
// 								<div className="flex items-center justify-between">
// 									<div className="space-y-1">
// 										<div className="flex items-center gap-2">
// 											<span className="text-gray-500">{__('Sent by:', 'trigger')}</span>
// 											<span>WordPress</span>
// 											<span className="text-gray-400">&lt;&gt;</span>
// 										</div>
// 										<div className="flex items-center gap-2">
// 											<span className="text-gray-500">{__('Sent to:', 'trigger')}</span>
// 											<span>{viewEmail.mail_to}</span>
// 										</div>
// 										<div className="flex items-center gap-2">
// 											<span className="text-gray-500">{__('Subject:', 'trigger')}</span>
// 											<span>{viewEmail.subject}</span>
// 										</div>
// 										<div className="flex items-center gap-2">
// 											<span className="text-gray-500">{__('Retries:', 'trigger')}</span>
// 											<span>0</span>
// 										</div>
// 									</div>

// 									<div className="text-right space-y-2">
// 										<div className="flex justify-end gap-2">
// 											<Badge variant="outline">{__('Default', 'trigger')}</Badge>
// 											<Badge variant="success">{__('Successful', 'trigger')}</Badge>
// 										</div>
// 										<div className="text-gray-500">
// 											{format(new Date(viewEmail.created_at), 'MMM dd, yyyy, hh:mm a')}
// 										</div>
// 									</div>
// 								</div>
// 							</div>

// 							<div className="space-y-4">
// 								<CollapsibleSection title="Email Body" defaultOpen>
// 									<div
// 										className="prose max-w-none"
// 										dangerouslySetInnerHTML={{ __html: viewEmail.message }}
// 									/>
// 								</CollapsibleSection>

// 								<CollapsibleSection title="Email Headers">
// 									<div className="space-y-2">
// 										<div className="grid grid-cols-[100px_1fr] gap-2">
// 											<span className="text-gray-500">From:</span>
// 											<span>{viewEmail.mail_from}</span>
// 										</div>
// 										<div className="grid grid-cols-[100px_1fr] gap-2">
// 											<span className="text-gray-500">Reply-To:</span>
// 											<span></span>
// 										</div>
// 										<div className="grid grid-cols-[100px_1fr] gap-2">
// 											<span className="text-gray-500">CC:</span>
// 											<span></span>
// 										</div>
// 										<div className="grid grid-cols-[100px_1fr] gap-2">
// 											<span className="text-gray-500">BCC:</span>
// 											<span></span>
// 										</div>
// 										<div className="grid grid-cols-[100px_1fr] gap-2">
// 											<span className="text-gray-500">Content-Type:</span>
// 											<span>text/html; charset=UTF-8</span>
// 										</div>
// 										<div className="grid grid-cols-[100px_1fr] gap-2">
// 											<span className="text-gray-500">X-Mailer:</span>
// 											<span>WordPress/6.7.2</span>
// 										</div>
// 									</div>
// 								</CollapsibleSection>

// 								<CollapsibleSection title="Attachments (0)">
// 									<div className="text-gray-500 italic">
// 										{__('No attachments found.', 'trigger')}
// 									</div>
// 								</CollapsibleSection>

// 								<CollapsibleSection title="Server Response">
// 									<pre className="bg-gray-50 p-4 rounded-md text-sm font-mono whitespace-pre-wrap">
// 										{viewEmail.headers}
// 									</pre>
// 								</CollapsibleSection>

// 							</div>
// 						</div>
// 					)}
// 				</DialogContent>
// 			</Dialog>

// 			{/* Delete Confirmation Dialog */}
// 			<ConfirmationDialog
// 				open={!!deleteEmail}
// 				onOpenChange={(open) => !open && setDeleteEmail(null)}
// 				title={deleteEmail?.id === -1 ? __('Delete Selected Email Logs', 'trigger') : __('Delete Email Log', 'trigger')}
// 				description={deleteEmail?.id === -1
// 					? __('Are you sure you want to delete all selected email logs? This action cannot be undone.', 'trigger')
// 					: __('Are you sure you want to delete this email log? This action cannot be undone.', 'trigger')
// 				}
// 				icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
// 				variant="danger"
// 				confirmText={__('Delete', 'trigger')}
// 				cancelText={__('Cancel', 'trigger')}
// 				onConfirm={async () => {
// 					if (deleteEmail) {
// 						if (deleteEmail.id === -1) {
// 							await handleBulkDelete()
// 						} else {
// 							await handleDelete(deleteEmail.id)
// 						}
// 					}
// 				}}
// 				loading={isDeleting || isBulkDeleting}
// 				loadingText={__('Deleting...', 'trigger')}
// 			>
// 				{deleteEmail && deleteEmail.id !== -1 && (
// 					<div className="space-y-2 mt-4">
// 						<div className="grid grid-cols-2 gap-2">
// 							<div>
// 								<span className="font-medium">{__('From:', 'trigger')}</span>
// 								<p className="text-sm text-muted-foreground">{deleteEmail.mail_from}</p>
// 							</div>
// 							<div>
// 								<span className="font-medium">{__('To:', 'trigger')}</span>
// 								<p className="text-sm text-muted-foreground">{deleteEmail.mail_to}</p>
// 							</div>
// 						</div>
// 						<div>
// 							<span className="font-medium">{__('Subject:', 'trigger')}</span>
// 							<p className="text-sm text-muted-foreground">{deleteEmail.subject}</p>
// 						</div>
// 					</div>
// 				)}
// 				{deleteEmail?.id === -1 && (
// 					<div className="mt-4">
// 						<p className="text-sm text-muted-foreground">
// 							{table.getSelectedRowModel().rows.length} {__('email logs will be deleted.', 'trigger')}
// 						</p>
// 					</div>
// 				)}
// 			</ConfirmationDialog>
// 		</div>
// 	)
// }

// export default EmailLogs