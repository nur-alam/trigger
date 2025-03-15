import { TableBody, TableCell, TableRow } from '@/components/ui/table'

interface DataTableSkeletonProps {
	columns: number
	rows?: number
}

export type { DataTableSkeletonProps }

export function DataTableSkeleton({
	columns,
	rows = 5,
}: DataTableSkeletonProps) {
	return (
		<TableBody>
			{Array.from({ length: rows }).map((_, i) => (
				<TableRow key={i}>
					{Array.from({ length: columns }).map((_, j) => (
						<TableCell key={j}>
							<div className="h-6 w-full animate-pulse rounded bg-gray-200" />
						</TableCell>
					))}
				</TableRow>
			))}
		</TableBody>
	)
} 