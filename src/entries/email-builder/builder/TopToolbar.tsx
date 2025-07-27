import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Save, ArrowLeft, X, Edit2, Check, XIcon } from 'lucide-react';

interface TopToolbarProps {
	viewMode: 'desktop' | 'mobile';
	setViewMode: (mode: 'desktop' | 'mobile') => void;
	templateId: string | null;
	templateName: string;
	onTemplateNameChange: (name: string) => void;
	onSave: () => void;
	onClose: () => void;
}

const TopToolbar = ({
	viewMode,
	setViewMode,
	templateId,
	templateName,
	onTemplateNameChange,
	onSave,
	onClose,
}: TopToolbarProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(templateName);

	useEffect(() => {
		setEditValue(templateName);
	}, [templateName]);

	const handleStartEdit = () => {
		setIsEditing(true);
		setEditValue(templateName);
	};

	const handleSaveEdit = () => {
		onTemplateNameChange(editValue);
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setEditValue(templateName);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSaveEdit();
		} else if (e.key === 'Escape') {
			handleCancelEdit();
		}
	};

	const getTemplateName = () => {
		if (templateName) return templateName;
		if (templateId) return `Template #${templateId}`;
		return 'Untitled Template';
	};

	return (
		<div className="bg-white border-b border-gray-200 pr-4 py-3">
			<div className="grid grid-cols-3 items-center justify-between">
				{/* Left Section - Template Info */}
				<div className="flex items-center space-x-4">
					{/* Back/Close Button */}
					<button
						onClick={onClose}
						className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back</span>
					</button>

					{/* Template Name */}
					<div className="flex items-center space-x-2">
						{isEditing ? (
							<div className="flex items-center space-x-2">
								<input
									type="text"
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									onKeyDown={handleKeyDown}
									onBlur={handleSaveEdit}
									className="px-2 py-1 text-lg font-semibold text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
									autoFocus
								/>
								<button
									onClick={handleSaveEdit}
									className="p-1 text-green-600 hover:text-green-700"
								>
									<Check className="w-4 h-4" />
								</button>
								<button
									onClick={handleCancelEdit}
									className="p-1 text-gray-400 hover:text-gray-600"
								>
									<XIcon className="w-4 h-4" />
								</button>
							</div>
						) : (
							<div className="flex items-center space-x-2 group">
								<h2 className="text-lg font-semibold text-gray-900">
									{getTemplateName()}
								</h2>
								<button
									onClick={handleStartEdit}
									className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<Edit2 className="w-4 h-4" />
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Center Section - View Mode Toggle */}
				<div className="flex justify-center bg-gray-100 rounded-lg p-1">
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

				{/* Right Section - Actions */}
				<div className="flex items-center justify-end space-x-3">
					<button
						onClick={onSave}
						className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
					>
						<Save className="w-4 h-4" />
						<span>Save Template</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default TopToolbar;