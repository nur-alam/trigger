import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
	fetchTemplatesAsync, 
	loadTemplateAsync, 
	saveTemplateAsync,
	deleteTemplateAsync
} from '@/store/thunks/emailBuilderThunks';
import { 
	selectIsLoading, 
	selectError 
} from '@/store/selectors/emailBuilderSelectors';
import { EmailTemplate } from './types';
import { 
	Plus, 
	Edit3, 
	Trash2, 
	Copy, 
	Calendar, 
	Search,
	Grid,
	List,
	Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailTemplatesProps {
	className?: string;
}

const EmailTemplates: React.FC<EmailTemplatesProps> = ({ className = '' }) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector(selectIsLoading);
	const error = useAppSelector(selectError);

	const [templates, setTemplates] = useState<EmailTemplate[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('updated');
	const [filterCategory, setFilterCategory] = useState<string>('all');

	// Load templates on component mount
	useEffect(() => {
		loadTemplates();
	}, []);

	const loadTemplates = async () => {
		try {
			const result = await dispatch(fetchTemplatesAsync()).unwrap();
			setTemplates(result);
		} catch (error) {
			toast.error('Failed to load templates');
			console.error('Error loading templates:', error);
		}
	};

	const handleCreateNew = () => {
		navigate('/email-builder');
	};

	const handleEditTemplate = async (templateId: string) => {
		try {
			await dispatch(loadTemplateAsync(templateId)).unwrap();
			navigate('/email-builder');
			toast.success('Template loaded successfully');
		} catch (error) {
			toast.error('Failed to load template');
			console.error('Error loading template:', error);
		}
	};

	const handleDuplicateTemplate = async (template: EmailTemplate) => {
		try {
			const duplicatedName = `${template.name} (Copy)`;
			await dispatch(saveTemplateAsync({ 
				name: duplicatedName, 
				components: template.components 
			})).unwrap();
			await loadTemplates(); // Refresh the list
			toast.success('Template duplicated successfully');
		} catch (error) {
			toast.error('Failed to duplicate template');
			console.error('Error duplicating template:', error);
		}
	};

	const handleDeleteTemplate = async (templateId: string) => {
		if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
			return;
		}

		try {
			await dispatch(deleteTemplateAsync(templateId)).unwrap();
			await loadTemplates(); // Refresh the list
			toast.success('Template deleted successfully');
		} catch (error) {
			toast.error('Failed to delete template');
			console.error('Error deleting template:', error);
		}
	};

	// Filter and sort templates
	const filteredAndSortedTemplates = templates
		.filter(template => 
			template.name.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name);
				case 'created':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'updated':
				default:
					return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
			}
		});

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(date));
	};

	const getComponentCount = (template: EmailTemplate) => {
		return template.components.length;
	};

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<div className="text-red-500 text-lg font-medium mb-2">Error Loading Templates</div>
					<div className="text-gray-600 mb-4">{error}</div>
					<button
						onClick={loadTemplates}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={`email-templates ${className}`}>
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
						<p className="text-gray-600 mt-1">Create and manage your email templates</p>
					</div>
					<button
						onClick={handleCreateNew}
						className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						<Plus size={20} />
						Create New Template
					</button>
				</div>
			</div>

			{/* Filters and Search */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-4 flex-1">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Search templates..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Sort */}
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as 'name' | 'created' | 'updated')}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="updated">Sort by Updated</option>
							<option value="created">Sort by Created</option>
							<option value="name">Sort by Name</option>
						</select>
					</div>

					{/* View Mode */}
					<div className="flex items-center gap-2">
						<button
							onClick={() => setViewMode('grid')}
							className={`p-2 rounded-lg transition-colors ${
								viewMode === 'grid' 
									? 'bg-blue-100 text-blue-600' 
									: 'text-gray-400 hover:text-gray-600'
							}`}
						>
							<Grid size={20} />
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`p-2 rounded-lg transition-colors ${
								viewMode === 'list' 
									? 'bg-blue-100 text-blue-600' 
									: 'text-gray-400 hover:text-gray-600'
							}`}
						>
							<List size={20} />
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 p-6">
				{isLoading ? (
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
							<div className="text-gray-600">Loading templates...</div>
						</div>
					</div>
				) : filteredAndSortedTemplates.length === 0 ? (
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="text-gray-400 text-6xl mb-4">📧</div>
							<div className="text-gray-600 text-lg font-medium mb-2">
								{searchTerm ? 'No templates found' : 'No templates yet'}
							</div>
							<div className="text-gray-500 mb-4">
								{searchTerm 
									? 'Try adjusting your search terms' 
									: 'Create your first email template to get started'
								}
							</div>
							{!searchTerm && (
								<button
									onClick={handleCreateNew}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
								>
									Create Your First Template
								</button>
							)}
						</div>
					</div>
				) : (
					<div className={
						viewMode === 'grid' 
							? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
							: 'space-y-4'
					}>
						{filteredAndSortedTemplates.map((template) => (
							<div
								key={template.id}
								className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow ${
									viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
								}`}
							>
								{viewMode === 'grid' ? (
									<>
										{/* Template Preview */}
										<div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
											<div className="text-gray-400 text-4xl">📧</div>
										</div>

										{/* Template Info */}
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 mb-1 truncate">
												{template.name}
											</h3>
											<div className="text-sm text-gray-500 mb-2">
												{getComponentCount(template)} components
											</div>
											<div className="text-xs text-gray-400 mb-3">
												Updated {formatDate(template.updatedAt)}
											</div>

											{/* Actions */}
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleEditTemplate(template.id)}
													className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
												>
													Edit
												</button>
												<button
													onClick={() => handleDuplicateTemplate(template)}
													className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
													title="Duplicate"
												>
													<Copy size={16} />
												</button>
												<button
													onClick={() => handleDeleteTemplate(template.id)}
													className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
													title="Delete"
												>
													<Trash2 size={16} />
												</button>
											</div>
										</div>
									</>
								) : (
									<>
										{/* List View */}
										<div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
											<div className="text-gray-400 text-xl">📧</div>
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 mb-1">
												{template.name}
											</h3>
											<div className="text-sm text-gray-500">
												{getComponentCount(template)} components • Updated {formatDate(template.updatedAt)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleEditTemplate(template.id)}
												className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
											>
												Edit
											</button>
											<button
												onClick={() => handleDuplicateTemplate(template)}
												className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
												title="Duplicate"
											>
												<Copy size={16} />
											</button>
											<button
												onClick={() => handleDeleteTemplate(template.id)}
												className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
												title="Delete"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default EmailTemplates;