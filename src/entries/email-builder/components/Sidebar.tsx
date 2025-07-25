import React from 'react';
import { Columns, Columns2, Columns3, Columns4, Type, Image, Square, Minus, Focus } from 'lucide-react';

const Sidebar = () => {
	const layouts = [
		{ id: 'column', icon: Columns, label: 'Column' },
		{ id: '2-column', icon: Columns2, label: '2 Column' },
		{ id: '3-column', icon: Columns3, label: '3 Column' },
		{ id: '4-column', icon: Columns4, label: '4 Column' },
	];

	const elements = [
		{ id: 'button', icon: Square, label: 'Button' },
		{ id: 'text', icon: Type, label: 'Text' },
		{ id: 'image', icon: Image, label: 'Image' },
		{ id: 'logo', icon: Focus, label: 'Logo' },
		{ id: 'logo-header', icon: Square, label: 'Logo Header' },
		{ id: 'divider', icon: Minus, label: 'Divider' },
		{ id: 'social-icons', icon: Focus, label: 'Social Icons' },
	];

	return (
		<div className="w-64 bg-white border-r border-gray-200 flex flex-col">
			{/* Logoipsum Header */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center space-x-2">
					<div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
					<span className="font-semibold text-gray-900">Logoipsum</span>
				</div>
			</div>

			{/* Layouts Section */}
			<div className="p-4">
				<h3 className="text-sm font-medium text-gray-900 mb-3">Layouts</h3>
				<div className="grid grid-cols-2 gap-2">
					{layouts.map((layout) => (
						<button
							key={layout.id}
							className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
						>
							<layout.icon className="w-6 h-6 text-gray-600 mb-1" />
							<span className="text-xs text-gray-600">{layout.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* Elements Section */}
			<div className="p-4">
				<h3 className="text-sm font-medium text-gray-900 mb-3">Elements</h3>
				<div className="grid grid-cols-2 gap-2">
					{elements.map((element) => (
						<button
							key={element.id}
							className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
						>
							<element.icon className="w-6 h-6 text-gray-600 mb-1" />
							<span className="text-xs text-gray-600">{element.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;