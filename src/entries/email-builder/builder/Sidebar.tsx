import React, { useState } from 'react';
import {
	Image,
	Video,
	Music,
	File
} from 'lucide-react';

import { ELEMENTS } from '@email-builder/elements';

import { elements, mediaItems, TabType, layouts, tabs, layers } from '@email-builder/utils/data';

const getMediaIcon = (type: string) => {
	switch (type) {
		case 'image': return Image;
		case 'video': return Video;
		case 'audio': return Music;
		default: return File;
	}
};

const Sidebar: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabType>('elements');


	const renderTabContent = () => {
		switch (activeTab) {
			case 'elements':
				return (
					<div className="flex-1 overflow-y-auto">
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
								{ELEMENTS.map((element) => (
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

			case 'layers':
				return (
					<div className="flex-1 overflow-y-auto">
						<div className="p-4">
							<h3 className="text-sm font-medium text-gray-900 mb-3">Layers</h3>
							<div className="space-y-2">
								{layers.map((layer) => (
									<div
										key={layer.id}
										className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
									>
										<div className="flex items-center space-x-3">
											<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
											<div>
												<div className="text-sm font-medium text-gray-900">{layer.name}</div>
												<div className="text-xs text-gray-500 capitalize">{layer.type}</div>
											</div>
										</div>
										<button
											className={`w-4 h-4 rounded ${layer.visible
												? 'bg-blue-500 text-white'
												: 'bg-gray-200 text-gray-400'
												} flex items-center justify-center text-xs`}
										>
											👁
										</button>
									</div>
								))}
							</div>
						</div>
					</div>
				);

			case 'media':
				return (
					<div className="flex-1 overflow-y-auto">
						<div className="p-4">
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-sm font-medium text-gray-900">Media Library</h3>
								<button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
									Upload
								</button>
							</div>
							<div className="space-y-2">
								{mediaItems.map((item) => {
									const IconComponent = getMediaIcon(item.type);
									return (
										<div
											key={item.id}
											className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
										>
											<div className="flex-shrink-0">
												{item.type === 'image' ? (
													<div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
														<Image className="w-5 h-5 text-gray-400" />
													</div>
												) : (
													<div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
														<IconComponent className="w-5 h-5 text-gray-400" />
													</div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="text-sm font-medium text-gray-900 truncate">
													{item.name}
												</div>
												<div className="text-xs text-gray-500">
													{item.size} • {item.type}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="w-[400px] bg-white border-r border-gray-200 flex">
			{/* Vertical Tab Navigation */}
			<div className="w-20 bg-gray-50 border-r border-gray-200 flex flex-col">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex flex-col items-center py-4 px-2 text-xs font-medium transition-colors border-r-2 border-transparent ${activeTab === tab.id
							? 'text-purple-600 bg-purple-100 border-r-2 border-purple-600'
							: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
							}`}
					>
						<tab.icon className="w-5 h-5 mb-1" />
						<span className="text-center leading-tight">{tab.label}</span>
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="flex-1 flex flex-col">
				{renderTabContent()}
			</div>
		</div>
	);
};

export default Sidebar;