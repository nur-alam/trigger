import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@email-builder/builder/Sidebar';
import Canvas from '@email-builder/builder/Canvas';
import SettingsPanel from '@email-builder/builder/SettingsPanel';
import TopToolbar from '@email-builder/builder/TopToolbar';

const EmailBuilder = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [selectedElement, setSelectedElement] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
	const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(id || null);
	const [currentTemplateName, setCurrentTemplateName] = useState<string>('');

	// Mock function to get template name by ID (replace with actual API call)
	const getTemplateNameById = (templateId: string): string => {
		const mockTemplates: Record<string, string> = {
			'1': 'Welcome Email Campaign',
			'2': 'Product Launch Newsletter',
			'3': 'Weekly Digest Template',
			'4': 'Abandoned Cart Reminder',
			'5': 'Holiday Special Offer'
		};
		return mockTemplates[templateId] || `Template #${templateId}`;
	};

	useEffect(() => {
		if (id) {
			// Edit mode - load existing template
			setCurrentTemplateId(id);
			setCurrentTemplateName(getTemplateNameById(id));
		} else {
			// Create mode - new template
			setCurrentTemplateId(null);
			setCurrentTemplateName('Untitled Template');
		}
	}, [id]);

	const handleTemplateNameChange = (newName: string) => {
		setCurrentTemplateName(newName);
		// Here you would typically update the template name in your backend/state
		console.log('Template name changed to:', newName);
	};

	const handleSaveTemplate = () => {
		// Handle save logic here
		console.log('Saving template...', {
			templateId: currentTemplateId,
			templateName: currentTemplateName,
			mode: id ? 'edit' : 'create'
		});
		// You can add actual save logic here
		// After saving, navigate back to the listing
		navigate('/');
	};

	const handleClose = () => {
		navigate('/');
	};

	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			{/* Top Toolbar */}
			<TopToolbar
				viewMode={viewMode}
				setViewMode={setViewMode}
				templateId={currentTemplateId}
				templateName={currentTemplateName}
				onTemplateNameChange={handleTemplateNameChange}
				onSave={handleSaveTemplate}
				onClose={handleClose}
			/>

			<div className="flex flex-1">
				{/* Left Sidebar */}
				<Sidebar />

				{/* Main Content Area */}
				<div className="flex-1 flex">
					{/* Canvas Area */}
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
	);
};

export default EmailBuilder;