import React, { useState, useMemo } from 'react';
import {
	Search,
	Grid3X3,
	List,
	Trash2,
	MoreVertical,
	Calendar,
	User,
	Eye,
	Edit,
	Copy,
	Filter,
	SortAsc,
	SortDesc,
	ChevronDown,
	Plus
} from 'lucide-react';

// Mock data for email templates
const mockEmailTemplates = [
	{
		id: '1',
		name: 'Welcome Email',
		subject: 'Welcome to our platform!',
		description: 'A warm welcome email for new users',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-20',
		author: 'John Doe',
		status: 'published',
		category: 'onboarding',
		opens: 1250,
		clicks: 89
	},
	{
		id: '2',
		name: 'Newsletter Template',
		subject: 'Monthly Newsletter - January 2024',
		description: 'Monthly newsletter template with latest updates',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-10',
		updatedAt: '2024-01-18',
		author: 'Jane Smith',
		status: 'draft',
		category: 'newsletter',
		opens: 890,
		clicks: 45
	},
	{
		id: '3',
		name: 'Product Launch',
		subject: 'Introducing our new product!',
		description: 'Announcement email for new product launch',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-08',
		updatedAt: '2024-01-16',
		author: 'Mike Johnson',
		status: 'published',
		category: 'marketing',
		opens: 2100,
		clicks: 156
	},
	{
		id: '4',
		name: 'Password Reset',
		subject: 'Reset your password',
		description: 'Security email for password reset requests',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-05',
		updatedAt: '2024-01-14',
		author: 'Sarah Wilson',
		status: 'published',
		category: 'transactional',
		opens: 450,
		clicks: 23
	},
	{
		id: '5',
		name: 'Order Confirmation',
		subject: 'Your order has been confirmed',
		description: 'Confirmation email for successful orders',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-03',
		updatedAt: '2024-01-12',
		author: 'Tom Brown',
		status: 'published',
		category: 'transactional',
		opens: 1800,
		clicks: 234
	},
	{
		id: '6',
		name: 'Holiday Sale',
		subject: 'Special Holiday Offers - 50% Off!',
		description: 'Promotional email for holiday season sales',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-10',
		author: 'Lisa Davis',
		status: 'scheduled',
		category: 'promotional',
		opens: 3200,
		clicks: 412
	}
];

type SortField = 'name' | 'createdAt' | 'updatedAt' | 'opens' | 'clicks';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

interface EmailListingProps {
	onCreateNew?: () => void;
	onEditTemplate?: (templateId: string) => void;
	onPreviewTemplate?: (templateId: string) => void;
}

const EmailListing: React.FC<EmailListingProps> = ({
	onCreateNew,
	onEditTemplate,
	onPreviewTemplate
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
	const [viewMode, setViewMode] = useState<ViewMode>('list'); // Changed from 'grid' to 'list'
	const [sortField, setSortField] = useState<SortField>('updatedAt');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
	const [filterCategory, setFilterCategory] = useState<string>('all');
	const [filterStatus, setFilterStatus] = useState<string>('all');

	// Filter and sort templates
	const filteredAndSortedTemplates = useMemo(() => {
		let filtered = mockEmailTemplates.filter(template => {
			const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
			const matchesStatus = filterStatus === 'all' || template.status === filterStatus;

			return matchesSearch && matchesCategory && matchesStatus;
		});

		// Sort templates
		filtered.sort((a, b) => {
			let aValue: any = a[sortField];
			let bValue: any = b[sortField];

			if (sortField === 'createdAt' || sortField === 'updatedAt') {
				aValue = new Date(aValue);
				bValue = new Date(bValue);
			}

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [searchTerm, filterCategory, filterStatus, sortField, sortOrder]);

	// Handle template selection
	const handleSelectTemplate = (templateId: string) => {
		setSelectedTemplates(prev =>
			prev.includes(templateId)
				? prev.filter(id => id !== templateId)
				: [...prev, templateId]
		);
	};

	const handleSelectAll = () => {
		if (selectedTemplates.length === filteredAndSortedTemplates.length) {
			setSelectedTemplates([]);
		} else {
			setSelectedTemplates(filteredAndSortedTemplates.map(t => t.id));
		}
	};

	// Handle delete
	const handleDeleteSelected = () => {
		if (selectedTemplates.length > 0) {
			const confirmed = window.confirm(
				`Are you sure you want to delete ${selectedTemplates.length} template(s)?`
			);
			if (confirmed) {
				// Here you would call your delete API
				console.log('Deleting templates:', selectedTemplates);
				setSelectedTemplates([]);
			}
		}
	};

	const handleDuplicateTemplate = (templateId: string) => {
		console.log('Duplicating template:', templateId);
		// Here you would call your duplicate API
	};

	const categories = ['all', 'onboarding', 'newsletter', 'marketing', 'transactional', 'promotional'];
	const statuses = ['all', 'published', 'draft', 'scheduled'];

	return (
		<div className="flex flex-col h-full bg-white">
			{/* Header */}
			<div className="border-b border-gray-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
						<p className="text-gray-600 mt-1">Manage and organize your email templates</p>
					</div>
					<button
						onClick={onCreateNew}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Plus className="w-4 h-4 mr-2" />
						Create New Template
					</button>
				</div>

				{/* Search and Filters */}
				<div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
					{/* Search */}
					<div className="relative flex-1 min-w-0">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search templates..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Filters */}
					<div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:flex-shrink-0">
						{/* Category Filter */}
						<select
							value={filterCategory}
							onChange={(e) => setFilterCategory(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 sm:min-w-[140px]"
						>
							{categories.map(category => (
								<option key={category} value={category}>
									{category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
								</option>
							))}
						</select>

						{/* Status Filter */}
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 sm:min-w-[120px]"
						>
							{statuses.map(status => (
								<option key={status} value={status}>
									{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
								</option>
							))}
						</select>

						{/* Sort */}
						<select
							value={`${sortField}-${sortOrder}`}
							onChange={(e) => {
								const [field, order] = e.target.value.split('-');
								setSortField(field as SortField);
								setSortOrder(order as SortOrder);
							}}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 sm:min-w-[140px]"
						>
							<option value="updatedAt-desc">Latest Updated</option>
							<option value="updatedAt-asc">Oldest Updated</option>
							<option value="createdAt-desc">Newest Created</option>
							<option value="createdAt-asc">Oldest Created</option>
							<option value="name-asc">Name A-Z</option>
							<option value="name-desc">Name Z-A</option>
							<option value="opens-desc">Most Opens</option>
							<option value="opens-asc">Least Opens</option>
						</select>
					</div>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex items-center justify-between p-4 border-b border-gray-200">
				<div className="flex items-center gap-4">
					{/* Select All Checkbox */}
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={selectedTemplates.length === filteredAndSortedTemplates.length && filteredAndSortedTemplates.length > 0}
							onChange={handleSelectAll}
							className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span className="ml-2 text-sm text-gray-600">
							{selectedTemplates.length > 0
								? `${selectedTemplates.length} selected`
								: `${filteredAndSortedTemplates.length} templates`
							}
						</span>
					</label>

					{/* Delete Button */}
					{selectedTemplates.length > 0 && (
						<button
							onClick={handleDeleteSelected}
							className="flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
						>
							<Trash2 className="w-4 h-4 mr-1" />
							Delete ({selectedTemplates.length})
						</button>
					)}
				</div>

				{/* View Mode Toggle */}
				<div className="flex items-center border border-gray-300 rounded-lg">
					<button
						onClick={() => setViewMode('grid')}
						className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
					>
						<Grid3X3 className="w-4 h-4" />
					</button>
					<button
						onClick={() => setViewMode('list')}
						className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
					>
						<List className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto p-6">
				{filteredAndSortedTemplates.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<Search className="w-12 h-12 mx-auto" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
						<p className="text-gray-600">Try adjusting your search or filters</p>
					</div>
				) : viewMode === 'grid' ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredAndSortedTemplates.map(template => (
							<TemplateCard
								key={template.id}
								template={template}
								isSelected={selectedTemplates.includes(template.id)}
								onSelect={() => handleSelectTemplate(template.id)}
								onEdit={() => onEditTemplate?.(template.id)}
								onPreview={() => onPreviewTemplate?.(template.id)}
								onDuplicate={() => handleDuplicateTemplate(template.id)}
							/>
						))}
					</div>
				) : (
					<div className="space-y-2">
						{filteredAndSortedTemplates.map(template => (
							<TemplateListItem
								key={template.id}
								template={template}
								isSelected={selectedTemplates.includes(template.id)}
								onSelect={() => handleSelectTemplate(template.id)}
								onEdit={() => onEditTemplate?.(template.id)}
								onPreview={() => onPreviewTemplate?.(template.id)}
								onDuplicate={() => handleDuplicateTemplate(template.id)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

// Template Card Component for Grid View
const TemplateCard: React.FC<{
	template: any;
	isSelected: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onPreview: () => void;
	onDuplicate: () => void;
}> = ({ template, isSelected, onSelect, onEdit, onPreview, onDuplicate }) => {
	const [showMenu, setShowMenu] = useState(false);

	return (
		<div className={`relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
			}`}>
			{/* Selection Checkbox */}
			<div className="absolute top-3 left-3 z-10">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={onSelect}
					className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
			</div>

			{/* Menu Button */}
			<div className="absolute top-3 right-3 z-10">
				<div className="relative">
					<button
						onClick={() => setShowMenu(!showMenu)}
						className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
					>
						<MoreVertical className="w-4 h-4 text-gray-600" />
					</button>

					{showMenu && (
						<div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
							<button
								onClick={() => { onPreview(); setShowMenu(false); }}
								className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
							>
								<Eye className="w-4 h-4 mr-2" />
								Preview
							</button>
							<button
								onClick={() => { onEdit(); setShowMenu(false); }}
								className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
							>
								<Edit className="w-4 h-4 mr-2" />
								Edit
							</button>
							<button
								onClick={() => { onDuplicate(); setShowMenu(false); }}
								className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
							>
								<Copy className="w-4 h-4 mr-2" />
								Duplicate
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Thumbnail with Preview Overlay */}
			<div className="relative aspect-video bg-gray-100 flex items-center justify-center group">
				<div className="text-gray-400 text-sm">Email Preview</div>

				{/* Quick Preview Button Overlay */}
				<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
					<button
						onClick={onPreview}
						className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 flex items-center space-x-2"
					>
						<Eye className="w-4 h-4" />
						<span className="text-sm font-medium">Quick Preview</span>
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="p-4">
				<div className="flex items-center justify-between mb-2">
					<h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
					<span className={`px-2 py-1 text-xs rounded-full ${template.status === 'published' ? 'bg-green-100 text-green-800' :
							template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
								'bg-blue-100 text-blue-800'
						}`}>
						{template.status}
					</span>
				</div>

				<p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.subject}</p>

				<div className="flex items-center justify-between text-xs text-gray-500">
					<div className="flex items-center">
						<User className="w-3 h-3 mr-1" />
						{template.author}
					</div>
					<div className="flex items-center">
						<Calendar className="w-3 h-3 mr-1" />
						{new Date(template.updatedAt).toLocaleDateString()}
					</div>
				</div>

				<div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
					<div className="text-xs text-gray-500">
						<span className="font-medium">{template.opens}</span> opens
					</div>
					<div className="text-xs text-gray-500">
						<span className="font-medium">{template.clicks}</span> clicks
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center space-x-2 mt-3">
					<button
						onClick={onPreview}
						className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
					>
						<Eye className="w-3 h-3 mr-1" />
						Preview
					</button>
					<button
						onClick={onEdit}
						className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<Edit className="w-3 h-3 mr-1" />
						Edit
					</button>
				</div>
			</div>
		</div>
	);
};

// Template List Item Component for List View
const TemplateListItem: React.FC<{
	template: any;
	isSelected: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onPreview: () => void;
	onDuplicate: () => void;
}> = ({ template, isSelected, onSelect, onEdit, onPreview, onDuplicate }) => {
	const [showMenu, setShowMenu] = useState(false);

	return (
		<div className={`flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
			}`}>
			{/* Selection Checkbox */}
			<input
				type="checkbox"
				checked={isSelected}
				onChange={onSelect}
				className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
			/>

			{/* Template Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<div className="flex-1 min-w-0">
						<h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
						<p className="text-sm text-gray-600 truncate">{template.subject}</p>
					</div>

					<div className="flex items-center space-x-6 ml-4">
						<span className={`px-2 py-1 text-xs rounded-full ${template.status === 'published' ? 'bg-green-100 text-green-800' :
								template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
									'bg-blue-100 text-blue-800'
							}`}>
							{template.status}
						</span>

						<div className="text-sm text-gray-500">
							{template.author}
						</div>

						<div className="text-sm text-gray-500">
							{new Date(template.updatedAt).toLocaleDateString()}
						</div>

						<div className="text-sm text-gray-500">
							{template.opens} opens
						</div>

						<div className="text-sm text-gray-500">
							{template.clicks} clicks
						</div>

						{/* Actions Menu */}
						<div className="relative">
							<button
								onClick={() => setShowMenu(!showMenu)}
								className="p-1 hover:bg-gray-100 rounded"
							>
								<MoreVertical className="w-4 h-4 text-gray-600" />
							</button>

							{showMenu && (
								<div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
									<button
										onClick={() => { onPreview(); setShowMenu(false); }}
										className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
									>
										<Eye className="w-4 h-4 mr-2" />
										Preview
									</button>
									<button
										onClick={() => { onEdit(); setShowMenu(false); }}
										className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
									>
										<Edit className="w-4 h-4 mr-2" />
										Edit
									</button>
									<button
										onClick={() => { onDuplicate(); setShowMenu(false); }}
										className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
									>
										<Copy className="w-4 h-4 mr-2" />
										Duplicate
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EmailListing;