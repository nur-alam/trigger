import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { __ } from '@wordpress/i18n'
import { debounce } from 'lodash'
import { useCallback } from 'react'

interface DataTableToolbarProps<TData> {
	table: Table<TData>
	searchKey?: string
	searchPlaceholder?: string
	onSearch?: (value: string) => void
	onDeleteSelected?: () => void
	enableSearch?: boolean
	renderCustomContent?: () => React.ReactNode
}

export type { DataTableToolbarProps }

export function DataTableToolbar<TData>({
	table,
	searchKey,
	searchPlaceholder = 'Search...',
	onSearch,
	onDeleteSelected,
	enableSearch = false,
	renderCustomContent,
}: DataTableToolbarProps<TData>) {
	const debouncedSearch = useCallback(
		debounce((value: string) => {
			if (onSearch) {
				onSearch(value)
			} else if (searchKey) {
				table.getColumn(searchKey)?.setFilterValue(value)
			}
		}, 500),
		[onSearch, searchKey, table]
	)

	const selectedRows = table.getFilteredSelectedRowModel().rows

	return (
		<div className="flex items-center justify-between h-12">
			{renderCustomContent ? (
				renderCustomContent()
			) : (
				<>
					<div className="flex-1">
						<h3 className="text-lg font-medium">{__('Email Logs', 'trigger')}</h3>
					</div>
					<div className="flex items-center gap-4">
						{selectedRows.length > 0 ? (
							<div className="flex items-center gap-4">
								<span className="text-sm text-muted-foreground">
									{selectedRows.length} {__('selected', 'trigger')}
								</span>
								{onDeleteSelected && (
									<Button
										variant="destructive"
										size="sm"
										onClick={onDeleteSelected}
										className="flex items-center gap-2"
									>
										<Trash2 className="h-4 w-4" />
										{__('Delete Selected', 'trigger')}
									</Button>
								)}
							</div>
						) : enableSearch ? (
							<Input
								placeholder={searchPlaceholder}
								onChange={(event) => {
									debouncedSearch(event.target.value)
								}}
								className="w-[300px]"
							/>
						) : null}
					</div>
				</>
			)}
		</div>
	)
} 