import React, { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Type, Palette } from 'lucide-react';

interface SettingsPanelProps {
	selectedElement: string | null;
}

const SettingsPanel = ({ selectedElement }: SettingsPanelProps) => {
	const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
	const [backgroundColor, setBackgroundColor] = useState('#ffffff');
	const [textColor, setTextColor] = useState('#ff0000');
	const [fontSize, setFontSize] = useState(16);
	const [padding, setPadding] = useState(10);
	const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');

	if (!selectedElement) {
		return (
			<div className="w-80 bg-white border-l border-gray-200 p-6">
				<div className="text-center text-gray-500">
					<Type className="w-12 h-12 mx-auto mb-4 text-gray-300" />
					<p className="text-sm">Select an element to edit its properties</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
			<div className="p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>

				{/* Outer Style Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Outer Style</h3>
				</div>

				{/* Text Area Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Text Area</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm text-gray-600 mb-2">Content</label>
							<textarea 
								className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
								rows={4}
								defaultValue="🔥 Exciting News! I've just published a new video on creating amazing email templates using AI! Learn how to build professional-looking emails effortlessly. Watch it now and level"
							/>
						</div>
					</div>
				</div>

				{/* Text Align Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Text Align</h3>
					<div className="flex space-x-2">
						<button
							onClick={() => setTextAlign('left')}
							className={`p-2 border rounded ${
								textAlign === 'left' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
							}`}
						>
							<AlignLeft className="w-4 h-4" />
						</button>
						<button
							onClick={() => setTextAlign('center')}
							className={`p-2 border rounded ${
								textAlign === 'center' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
							}`}
						>
							<AlignCenter className="w-4 h-4" />
						</button>
						<button
							onClick={() => setTextAlign('right')}
							className={`p-2 border rounded ${
								textAlign === 'right' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
							}`}
						>
							<AlignRight className="w-4 h-4" />
						</button>
					</div>
				</div>

				{/* Background Color Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Background Color</h3>
					<div className="flex items-center space-x-3">
						<input
							type="color"
							value={backgroundColor}
							onChange={(e) => setBackgroundColor(e.target.value)}
							className="w-12 h-8 border border-gray-200 rounded cursor-pointer"
						/>
						<input
							type="text"
							value={backgroundColor}
							onChange={(e) => setBackgroundColor(e.target.value)}
							className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm"
						/>
					</div>
				</div>

				{/* Text Color Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Text Color</h3>
					<div className="flex items-center space-x-3">
						<input
							type="color"
							value={textColor}
							onChange={(e) => setTextColor(e.target.value)}
							className="w-12 h-8 border border-gray-200 rounded cursor-pointer"
						/>
						<span className="text-sm text-gray-600">Red</span>
					</div>
				</div>

				{/* Font Size Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Font Size</h3>
					<div className="flex items-center space-x-3">
						<input
							type="number"
							value={fontSize}
							onChange={(e) => setFontSize(Number(e.target.value))}
							className="w-20 px-3 py-2 border border-gray-200 rounded text-sm"
						/>
						<span className="text-sm text-gray-600">px</span>
					</div>
				</div>

				{/* Text Transform Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Text Transform</h3>
					<div className="flex space-x-2">
						<button
							onClick={() => setFontWeight('normal')}
							className={`px-3 py-1 text-sm border rounded ${
								fontWeight === 'normal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
							}`}
						>
							Aa
						</button>
						<button
							onClick={() => setFontWeight('bold')}
							className={`px-3 py-1 text-sm border rounded font-bold ${
								fontWeight === 'bold' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
							}`}
						>
							Aa
						</button>
						<button className="px-3 py-1 text-sm border border-gray-200 rounded italic">
							Aa
						</button>
					</div>
				</div>

				{/* Padding Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Padding</h3>
					<div className="flex items-center space-x-3">
						<input
							type="number"
							value={padding}
							onChange={(e) => setPadding(Number(e.target.value))}
							className="w-20 px-3 py-2 border border-gray-200 rounded text-sm"
						/>
						<span className="text-sm text-gray-600">px</span>
					</div>
				</div>

				{/* Font Width Section */}
				<div className="mb-6">
					<h3 className="text-sm font-medium text-gray-900 mb-3">Font Width</h3>
					<select className="w-full px-3 py-2 border border-gray-200 rounded text-sm">
						<option value="normal">normal</option>
						<option value="condensed">condensed</option>
						<option value="expanded">expanded</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default SettingsPanel;