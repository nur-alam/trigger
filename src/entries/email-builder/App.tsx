import React, { useState } from 'react';
import Sidebar from '@email-builder/components/Sidebar';
import Canvas from '@email-builder/components/Canvas';
import SettingsPanel from '@email-builder/components/SettingsPanel';
import TopToolbar from '@email-builder/components/TopToolbar';
import EmailListing from '@email-builder/components/EmailListing';
import Modal from '@email-builder/components/Modal';

const App = () => {
	const [selectedElement, setSelectedElement] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
	const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);

	// Modal states
	const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
	const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
	const [builderMode, setBuilderMode] = useState<'create' | 'edit'>('create');

	const handleCreateNew = () => {
		setCurrentTemplateId(null);
		setBuilderMode('create');
		setIsBuilderModalOpen(true);
		setSelectedElement(null);
	};

	const handleEditTemplate = (templateId: string) => {
		setCurrentTemplateId(templateId);
		setBuilderMode('edit');
		setIsBuilderModalOpen(true);
		setSelectedElement(null);
	};

	const handlePreviewTemplate = (templateId: string) => {
		setCurrentTemplateId(templateId);
		setIsCanvasModalOpen(true);
		setSelectedElement(null);
	};

	const handleCloseCanvasModal = () => {
		setIsCanvasModalOpen(false);
		setCurrentTemplateId(null);
		setSelectedElement(null);
	};

	const handleCloseBuilderModal = () => {
		setIsBuilderModalOpen(false);
		setCurrentTemplateId(null);
		setSelectedElement(null);
		setViewMode('desktop'); // Reset view mode
	};

	const handleSaveTemplate = () => {
		// Handle save logic here
		console.log('Saving template...', { templateId: currentTemplateId, mode: builderMode });
		// You can add actual save logic here
		handleCloseBuilderModal();
	};

	return (
		<>
			{/* Main Email Listing View */}
			<div className="h-screen bg-gray-50">
				<EmailListing
					onCreateNew={handleCreateNew}
					onEditTemplate={handleEditTemplate}
					onPreviewTemplate={handlePreviewTemplate}
				/>
			</div>

			{/* Preview Modal */}
			<Modal
				isOpen={isCanvasModalOpen}
				onClose={handleCloseCanvasModal}
				title={`Preview Template ${currentTemplateId ? `#${currentTemplateId}` : ''}`}
				size="full"
			>
				<div className="flex h-full">
					{/* Canvas in Modal */}
					<div className="flex-1 flex flex-col">
						{/* Mini Toolbar for Preview Modal */}
						<div className="bg-white border-b border-gray-200 px-4 py-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<div className="flex bg-gray-100 rounded-lg p-1">
										<button
											onClick={() => setViewMode('desktop')}
											className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'desktop'
													? 'bg-white text-gray-900 shadow-sm'
													: 'text-gray-600 hover:text-gray-900'
												}`}
										>
											<span>Desktop</span>
										</button>
										<button
											onClick={() => setViewMode('mobile')}
											className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'mobile'
													? 'bg-white text-gray-900 shadow-sm'
													: 'text-gray-600 hover:text-gray-900'
												}`}
										>
											<span>Mobile</span>
										</button>
									</div>
								</div>
								<div className="text-sm text-gray-600">
									Preview Mode
								</div>
							</div>
						</div>

						{/* Canvas */}
						<Canvas
							viewMode={viewMode}
							selectedElement={selectedElement}
							setSelectedElement={setSelectedElement}
						/>
					</div>

					{/* Settings Panel in Preview Modal */}
					<SettingsPanel selectedElement={selectedElement} />
				</div>
			</Modal>

			{/* Builder Modal (Create/Edit) */}
			<Modal
				isOpen={isBuilderModalOpen}
				onClose={handleCloseBuilderModal}
				title={builderMode === 'create' ? 'Create New Template' : `Edit Template ${currentTemplateId ? `#${currentTemplateId}` : ''}`}
				size="full"
			>
				<div className="flex h-full">
					{/* Left Sidebar */}
					<Sidebar />

					{/* Main Content Area */}
					<div className="flex-1 flex flex-col">
						{/* Top Toolbar */}
						<TopToolbar
							viewMode={viewMode}
							setViewMode={setViewMode}
							templateId={currentTemplateId}
							onSave={handleSaveTemplate}
							onClose={handleCloseBuilderModal}
							isModal={true}
						/>

						{/* Canvas Area */}
						<div className="flex-1 flex">
							<Canvas
								viewMode={viewMode}
								selectedElement={selectedElement}
								setSelectedElement={setSelectedElement}
							/>

							{/* Right Settings Panel */}
							<SettingsPanel selectedElement={selectedElement} />
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default App;