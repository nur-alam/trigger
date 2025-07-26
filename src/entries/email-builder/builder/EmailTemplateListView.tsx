import { Copy, Edit, Eye, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Template List Item Component for List View
interface EmailTemplateListViewProps {
	template: any;
	isSelected: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onPreview: () => void;
	onDuplicate: () => void;
}

const EmailTemplateListView = ({ template, isSelected, onSelect, onEdit, onPreview, onDuplicate }: EmailTemplateListViewProps) => {
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const editTemplate = (templateId: string) => {
		navigate(`/edit/email-template/${templateId}`);
	};

	// Handle click outside to close menu
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowMenu(false);
			}
		};

		if (showMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showMenu]);

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
						<div className="relative" ref={menuRef}>
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
										// onClick={() => { onEdit(); setShowMenu(false); }}
										onClick={() => editTemplate(template.id)}
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

export default EmailTemplateListView;
