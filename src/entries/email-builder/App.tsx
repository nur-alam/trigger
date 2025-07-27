import React from 'react'
import EmailTemplateListing from '@email-builder/builder/EmailTemplateListing';
import CodeSnap from '@email-builder/old/codesnap';

const App = () => {
	return (
		<EmailTemplateListing />
		// <CodeSnap />
	)
}

export default App

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import EmailListing from '@email-builder/components/EmailListing';

// const App = () => {
// 	const navigate = useNavigate();

// 	const handleCreateNew = () => {
// 		navigate('/new');
// 	};

// 	const handleEditTemplate = (templateId: string) => {
// 		navigate(`/email-template/${templateId}`);
// 	};

// 	const handlePreviewTemplate = (templateId: string) => {
// 		// For preview, you can either:
// 		// 1. Navigate to a preview route: navigate(`/preview/${templateId}`);
// 		// 2. Or keep the modal functionality for preview only
// 		console.log('Preview template:', templateId);
// 		// For now, let's navigate to edit mode for preview
// 		navigate(`/email-template/${templateId}`);
// 	};

// 	return (
// 		<div className="h-screen bg-gray-50">
// 			<EmailListing
// 				onCreateNew={handleCreateNew}
// 				onEditTemplate={handleEditTemplate}
// 				onPreviewTemplate={handlePreviewTemplate}
// 			/>
// 		</div>
// 	);
// };

// export default App;