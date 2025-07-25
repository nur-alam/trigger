import React from 'react';
import { Monitor, Smartphone, Code, Send, Save, ArrowLeft, FileText, X } from 'lucide-react';

interface TopToolbarProps {
	viewMode: 'desktop' | 'mobile';
	setViewMode: (mode: 'desktop' | 'mobile') => void;
	onBackToListing?: () => void;
	templateId?: string | null;
	onSave?: () => void;
	onClose?: () => void;
	isModal?: boolean;
}

const TopToolbar = ({ 
	viewMode, 
	setViewMode, 
	onBackToListing, 
	templateId, 
	onSave, 
	onClose, 
	isModal = false 
}: TopToolbarProps) => {
	return (
		<div className="bg-white border-b border-gray-200 px-4 py-3">
			<div className="flex items-center justify-between">
				{/* Left side - Back/Close button and template info */}
				<div className="flex items-center space-x-4">
					{isModal ? (
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
					)}
					
					<div className="flex items-center space-x-2 text-sm text-gray-600">
						<FileText className="w-4 h-4" />
						<span>{templateId ? `Editing Template #${templateId}` : 'New Template'}</span>
					</div>

					{/* View mode toggles */}
					<div className="flex bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setViewMode('desktop')}
							className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
								viewMode === 'desktop'
									? 'bg-white text-gray-900 shadow-sm'
									: 'text-gray-600 hover:text-gray-900'
							}`}
						>
							<Monitor className="w-4 h-4" />
							<span>Desktop</span>
						</button>
						<button
							onClick={() => setViewMode('mobile')}
							className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
								viewMode === 'mobile'
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