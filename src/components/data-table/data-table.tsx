import React from 'react'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	SortingState,
	PaginationState,
	ColumnFiltersState,
	getFilteredRowModel,
	RowSelectionState,
	OnChangeFn,
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { DataTableSkeleton } from './data-table-skeleton'

interface DataTableProps<TData> {
	columns: ColumnDef<TData>[]
	data: TData[]
	pageCount: number
	loading?: boolean
	sorting?: SortingState
	pagination?: PaginationState
	columnFilters?: ColumnFiltersState
	rowSelection?: RowSelectionState
	searchKey?: string
	searchPlaceholder?: string
	onSearch?: (value: string) => void
	onPaginationChange?: OnChangeFn<PaginationState>
	onSortingChange?: OnChangeFn<SortingState>
	onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
	onRowSelectionChange?: OnChangeFn<RowSelectionState>
	onDeleteSelected?: () => void
	enableRowSelection?: boolean
	enableSearch?: boolean
	enablePagination?: boolean
	renderToolbar?: () => React.ReactNode
	renderEmpty?: () => React.ReactNode
	getRowId?: (row: TData) => string
}

export type { DataTableProps }

export function DataTable<TData>({
	columns,
	data,
	pageCount,
	loading = false,
	sorting = [],
	pagination,
	columnFilters = [],
	rowSelection = {},
	searchKey,
	searchPlaceholder,
	onSearch,
	onPaginationChange,
	onSortingChange,
	onColumnFiltersChange,
	onRowSelectionChange,
	onDeleteSelected,
	enableRowSelection = false,
	enableSearch = false,
	enablePagination = true,
	renderToolbar,
	renderEmpty,
	getRowId,
}: DataTableProps<TData>) {
	const table = useReactTable({
		data,
		columns,
		pageCount,
		state: {
			sorting,
			pagination,
			columnFilters,
			rowSelection,
		},
		enableRowSelection,
		onRowSelectionChange,
		onPaginationChange,
		onSortingChange,
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange,
		getFilteredRowModel: getFilteredRowModel(),
		manualPagination: true,
		getRowId,
	})

	if (loading) {
		return (
			<div className="space-y-4">
				{(renderToolbar || enableSearch) && (
					<DataTableToolbar
						table={table}
						searchKey={searchKey}
						searchPlaceholder={searchPlaceholder}
						onSearch={onSearch}
						onDeleteSelected={onDeleteSelected}
						enableSearch={enableSearch}
						renderCustomContent={renderToolbar}
					/>
				)}
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
						<DataTableSkeleton columns={columns.length} />
					</Table>
				</div>
				{enablePagination && (
					<DataTablePagination table={table} loading={loading} />
				)}
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{(renderToolbar || enableSearch) && (
				<DataTableToolbar
					table={table}
					searchKey={searchKey}
					searchPlaceholder={searchPlaceholder}
					onSearch={onSearch}
					onDeleteSelected={onDeleteSelected}
					enableSearch={enableSearch}
					renderCustomContent={renderToolbar}
				/>
			)}
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
					{table.getRowModel().rows?.length ? (
						<TableBody>
							{table.getRowModel().rows.map((row) => (
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
							))}
						</TableBody>
					) : (
						<TableBody>
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{renderEmpty ? renderEmpty() : 'No results found.'}
								</TableCell>
							</TableRow>
						</TableBody>
					)}
				</Table>
			</div>
			{enablePagination && (
				<DataTablePagination table={table} loading={loading} />
			)}
		</div>
	)
} 