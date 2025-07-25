import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Code, Send, Save, ArrowLeft, FileText, X, Edit3 } from 'lucide-react';

interface TopToolbarProps {
	viewMode: 'desktop' | 'mobile';
	setViewMode: (mode: 'desktop' | 'mobile') => void;
	onBackToListing?: () => void;
	templateId?: string | null;
	templateName?: string;
	onTemplateNameChange?: (name: string) => void;
	onSave?: () => void;
	onClose?: () => void;
	isModal?: boolean;
}

const TopToolbar = ({
	viewMode,
	setViewMode,
	onBackToListing,
	templateId,
	templateName,
	onTemplateNameChange,
	onSave,
	onClose,
	isModal = false
}: TopToolbarProps) => {
	const [isEditingName, setIsEditingName] = useState(false);
	const [localTemplateName, setLocalTemplateName] = useState('');

	// Set default template name based on mode
	useEffect(() => {
		if (templateName) {
			setLocalTemplateName(templateName);
		} else if (templateId) {
			// If editing existing template but no name provided, use a default
			setLocalTemplateName(`Template #${templateId}`);
		} else {
			// New template - use dummy name
			setLocalTemplateName('Untitled Template');
		}
	}, [templateId, templateName]);

	const handleNameEdit = () => {
		setIsEditingName(true);
	};

	const handleNameSave = () => {
		setIsEditingName(false);
		if (onTemplateNameChange) {
			onTemplateNameChange(localTemplateName);
		}
	};

	const handleNameCancel = () => {
		setIsEditingName(false);
		// Reset to original name
		if (templateName) {
			setLocalTemplateName(templateName);
		} else if (templateId) {
			setLocalTemplateName(`Template #${templateId}`);
		} else {
			setLocalTemplateName('Untitled Template');
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleNameSave();
		} else if (e.key === 'Escape') {
			handleNameCancel();
		}
	};

	return (
		<div className="bg-white border-b border-gray-200 px-4 py-3">
			<div className="flex items-center justify-between">
				{/* Left side - Back/Close button and template info */}
				<div className="flex items-center space-x-4">
					{/* {isModal ? (
						// Close button for modal
						onClose && (
							<button
								onClick={onClose}
								className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
							>
								<X className="w-4 h-4" />
								<span>Close</span>
							</button>
						)
					) : (
						// Back button for full page view
						onBackToListing && (
							<button
								onClick={onBackToListing}
								className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
							>
								<ArrowLeft className="w-4 h-4" />
								<span>Back to Templates</span>
							</button>
						)
					)} */}

					{/* Editable Template Name */}
					<div className="flex items-center space-x-2">
						<FileText className="w-4 h-4 text-gray-600" />
						{isEditingName ? (
							<div className="flex items-center space-x-2">
								<input
									type="text"
									value={localTemplateName}
									onChange={(e) => setLocalTemplateName(e.target.value)}
									onKeyDown={handleKeyPress}
									onBlur={handleNameSave}
									className="text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[200px]"
									autoFocus
									placeholder="Enter template name..."
								/>
								<button
									onClick={handleNameSave}
									className="text-green-600 hover:text-green-700 p-1"
									title="Save name"
								>
									<Save className="w-3 h-3" />
								</button>
								<button
									onClick={handleNameCancel}
									className="text-gray-400 hover:text-gray-600 p-1"
									title="Cancel"
								>
									<X className="w-3 h-3" />
								</button>
							</div>
						) : (
							<div className="flex items-center space-x-2 group">
								<span className="text-sm font-medium text-gray-900">
									{localTemplateName}
								</span>
								<button
									onClick={handleNameEdit}
									className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 p-1 transition-opacity"
									title="Edit template name"
								>
									<Edit3 className="w-3 h-3" />
								</button>
							</div>
						)}
					</div>

					{/* View mode toggles */}
					<div className="flex bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setViewMode('desktop')}
							className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'desktop'
									? 'bg-white text-gray-900 shadow-sm'
									: 'text-gray-600 hover:text-gray-900'
								}`}
						>
							<Monitor className="w-4 h-4" />
							<span>Desktop</span>
						</button>
						<button
							onClick={() => setViewMode('mobile')}
							className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'mobile'
									? 'bg-white text-gray-900 shadow-sm'
									: 'text-gray-600 hover:text-gray-900'
								}`}
						>
							<Smartphone className="w-4 h-4" />
							<span>Mobile</span>
						</button>
					</div>
				</div>

				{/* Right side - Action buttons */}
				<div className="flex items-center space-x-3">
					<button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
						<Code className="w-4 h-4" />
						<span>Code</span>
					</button>
					<button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
						<Send className="w-4 h-4" />
						<span>Send Test Email</span>
					</button>

					{/* Save button - use onSave if provided (for modal), otherwise default behavior */}
					<button
						onClick={onSave}
						className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
					>
						<Save className="w-4 h-4" />
						<span>Save Template</span>
					</button>

					{/* Additional close button for modal (alternative placement) */}
					{isModal && onClose && (
						<button
							onClick={onClose}
							className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default TopToolbar;