// import { TableProvider } from './TableContext'
import DataTable from './DataTable'
import { Button } from '@/components/ui/button'

const Trigger = () => {
	return (
		// <TableProvider>
		<div className='m-20'>
			<Button />
			<DataTable />
		</div>
		// </TableProvider>
	)
}

export default Trigger