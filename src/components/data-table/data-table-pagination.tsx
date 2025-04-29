import { Table } from '@tanstack/react-table'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { __ } from '@wordpress/i18n'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
	loading?: boolean
}

export type { DataTablePaginationProps }

export function DataTablePagination<TData>({
	table,
	loading = false,
}: DataTablePaginationProps<TData>) {
	return (
		<div className="flex flex-wrap items-center justify-between space-x-2 py-4">
			<div className="flex-1 text-sm text-muted-foreground hidden lg:block">
				{table.getFilteredSelectedRowModel().rows.length} of{' '}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div className="flex-1 flex space-x-2 items-center justify-center">
				<p className="text-sm font-medium">
					{__('Rows per page', 'triggermail')}
				</p>
				<select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value))
					}}
					className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							{pageSize}
						</option>
					))}
				</select>
			</div>
			<Pagination className="flex-1 justify-end">
				<PaginationContent className="gap-2">
					<PaginationItem>
						<PaginationPrevious
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage() || loading}
							aria-disabled={!table.getCanPreviousPage() || loading}
							className="h-8 min-w-8 px-2"
						/>
					</PaginationItem>
					{Array.from({ length: table.getPageCount() }, (_, i) => {
						const pageNumber = i + 1;
						const currentPage = table.getState().pagination.pageIndex + 1;

						if (
							pageNumber === 1 ||
							pageNumber === table.getPageCount() ||
							(pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
						) {
							return (
								<PaginationItem key={i}>
									<PaginationLink
										onClick={() => table.setPageIndex(i)}
										isActive={currentPage === pageNumber}
										className="h-8 min-w-8 px-3"
									>
										{pageNumber}
									</PaginationLink>
								</PaginationItem>
							);
						} else if (
							(pageNumber === 2 && currentPage > 3) ||
							(pageNumber === table.getPageCount() - 1 && currentPage < table.getPageCount() - 2)
						) {
							return (
								<PaginationItem key={i}>
									<PaginationEllipsis className="h-8" />
								</PaginationItem>
							);
						}
						return null;
					})}
					<PaginationItem>
						<PaginationNext
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage() || loading}
							aria-disabled={!table.getCanNextPage() || loading}
							className="h-8 min-w-8 px-2"
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
} 