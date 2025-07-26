import { useEffect, useRef, useState } from "react";
import { MoreVertical, Edit, Eye, Copy, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Template Card Component for Grid View
interface EmailTemplateGridViewProps {
	template: any;
	isSelected: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onPreview: () => void;
	onDuplicate: () => void;
}

const EmailTemplateGridView = ({ template, isSelected, onSelect, onEdit, onPreview, onDuplicate }: EmailTemplateGridViewProps) => {
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
				<div className="relative" ref={menuRef}>
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
						// onClick={onEdit}
						onClick={() => editTemplate(template.id)}
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

export default EmailTemplateGridView;
