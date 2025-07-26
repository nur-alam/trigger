import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface CanvasProps {
	viewMode: 'desktop' | 'mobile';
	selectedElement: string | null;
	setSelectedElement: (element: string | null) => void;
}

const Canvas = ({ viewMode, selectedElement, setSelectedElement }: CanvasProps) => {
	const handleElementClick = (elementId: string) => {
		setSelectedElement(elementId);
	};

	return (
		<div className="flex-1 bg-gray-100 p-8 overflow-auto">
			<div className="flex justify-center">
				<div 
					className={`bg-white shadow-lg transition-all duration-300 ${
						viewMode === 'desktop' ? 'w-full max-w-2xl' : 'w-80'
					}`}
					style={{ minHeight: '600px' }}
				>
					{/* Email Header */}
					<div className="p-6 text-center border-b border-gray-100">
						<div className="flex items-center justify-center space-x-2 mb-2">
							<div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
							<span className="font-semibold text-gray-900">Logoipsum</span>
						</div>
					</div>

					{/* Main Content */}
					<div className="p-6">
						{/* Hero Image Section */}
						<div 
							className={`relative mb-6 cursor-pointer rounded-lg overflow-hidden ${
								selectedElement === 'hero-image' ? 'ring-2 ring-blue-500' : ''
							}`}
							onClick={() => handleElementClick('hero-image')}
						>
							<div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 text-center relative">
								<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
									<div className="flex space-x-1">
										<button className="p-1 bg-white/20 rounded hover:bg-white/30">
											<ArrowUp className="w-3 h-3" />
										</button>
										<button className="p-1 bg-white/20 rounded hover:bg-white/30">
											<ArrowDown className="w-3 h-3" />
										</button>
										<button className="p-1 bg-white/20 rounded hover:bg-white/30">
											<Trash2 className="w-3 h-3" />
										</button>
									</div>
								</div>
								<h1 className="text-2xl font-bold mb-2">Build Full Stack App</h1>
								<h2 className="text-xl mb-4">React Native</h2>
								<h3 className="text-lg mb-4">Full Course</h3>
								<p className="text-sm mb-4">Build Your 1st AI App</p>
								<div className="flex items-center justify-center space-x-2 mb-4">
									<span className="text-sm">Aexpa</span>
									<div className="w-6 h-6 bg-white/20 rounded"></div>
								</div>
								<div className="absolute right-4 top-4">
									<div className="w-24 h-32 bg-white/20 rounded-lg"></div>
								</div>
							</div>
						</div>

						{/* Text Content */}
						<div 
							className={`mb-6 cursor-pointer p-2 rounded ${
								selectedElement === 'text-content' ? 'ring-2 ring-blue-500' : ''
							}`}
							onClick={() => handleElementClick('text-content')}
						>
							<p className="text-red-600 text-sm mb-2">
								🔥 Exciting News! I've just published a new video on creating amazing email templates using AI! Learn how to build professional-looking emails effortlessly. Watch it now and level up your email game! 🔥
							</p>
						</div>

						{/* CTA Button */}
						<div 
							className={`text-center mb-6 cursor-pointer ${
								selectedElement === 'cta-button' ? 'ring-2 ring-blue-500 rounded' : ''
							}`}
							onClick={() => handleElementClick('cta-button')}
						>
							<button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
								Watch Now
							</button>
						</div>

						{/* Footer Text */}
						<div 
							className={`text-center cursor-pointer p-2 rounded ${
								selectedElement === 'footer-text' ? 'ring-2 ring-blue-500' : ''
							}`}
							onClick={() => handleElementClick('footer-text')}
						>
							<p className="text-gray-600 text-sm">
								Don't Miss Out On The Latest Tips And Tricks For AI-Powered Email Template Generation. See How Easy It Is To Create Professional And Stunning Email Designs With The Help Of AI! Click To
							</p>
						</div>

						{/* Placeholder Image */}
						<div 
							className={`mt-6 cursor-pointer ${
								selectedElement === 'placeholder-image' ? 'ring-2 ring-blue-500 rounded' : ''
							}`}
							onClick={() => handleElementClick('placeholder-image')}
						>
							<div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
								<div className="text-center">
									<div className="w-12 h-12 bg-gray-300 rounded mx-auto mb-2"></div>
									<span className="text-gray-500 text-sm">Image Placeholder</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Canvas;