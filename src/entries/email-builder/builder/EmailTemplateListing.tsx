import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
	Search,
	Grid3X3,
	List,
	Trash2,
	Plus
} from 'lucide-react';

import mockEmailTemplates from '@email-builder/utils/data';
import EmailTemplateGridView from './EmailTemplateGridView';
import EmailTemplateListView from './EmailTemplateListView';
import { useNavigate } from 'react-router-dom';

type SortField = 'name' | 'createdAt' | 'updatedAt' | 'opens' | 'clicks';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

interface EmailTemplateListingProps {
	onCreateNew?: () => void;
	onEditTemplate?: (templateId: string) => void;
	onPreviewTemplate?: (templateId: string) => void;
}

const EmailTemplateListing = ({ onCreateNew, onEditTemplate, onPreviewTemplate }: EmailTemplateListingProps) => {
	const navigate = useNavigate();

	const createNewTemplate = () => {
		navigate('/create/new-email-template');
	};

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
						onClick={createNewTemplate}
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
							<EmailTemplateGridView
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
							<EmailTemplateListView
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


export default EmailTemplateListing;
