import { Input } from '@/components/ui/input'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { users } from '@/pages/triggermail/data'

const DataTable = () => {
	return (
		<div className='space-y-4'>
			<span className='mr-4'>DataTable</span>
			<Input type="text" placeholder='Search...' value={''} className='' onChange={() => { }} />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Company</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableHead>{user.name}</TableHead>
							<TableHead>{user.email}</TableHead>
							<TableHead>{user.company}</TableHead>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default DataTable