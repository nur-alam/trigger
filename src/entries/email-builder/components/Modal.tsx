import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	size = 'xl'
}) => {
	// Handle escape key press
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			// Prevent body scroll when modal is open
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-6xl',
		full: 'max-w-[100vw] max-h-[100vh]'
	};

	return (
		<div className="fixed inset-0 z-[999999999] overflow-auto">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div
					className={`absolute inset-0 min-h-screen h-full bg-white shadow-xl w-full ${sizeClasses[size]} ${size === 'full' ? 'h-[100vh]' : 'max-h-[100vh]'
						} flex flex-col`}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					{title && (
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h2 className="text-xl font-semibold text-gray-900">{title}</h2>
							<button
								onClick={onClose}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<X className="w-5 h-5 text-gray-500" />
							</button>
						</div>
					)}

					{/* Close button when no title */}
					{!title && (
						<button
							onClick={onClose}
							className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors bg-white shadow-sm"
						>
							<X className="w-5 h-5 text-gray-500" />
						</button>
					)}

					{/* Content */}
					<div className="flex-1 overflow-auto">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;