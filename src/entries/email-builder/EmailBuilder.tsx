import React, { useState } from 'react';
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
	pointerWithin,
	DragOverlay,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { __ } from '@wordpress/i18n';
import {
	Undo2,
	Redo2,
	Save,
	Eye,
	Download,
	Upload,
	Palette,
	Settings,
	Type,
	Heading,
	MousePointer,
	Image,
	Minus,
	Space,
	Share2,
	FileText,
} from 'lucide-react';

import { useEmailBuilderRedux } from './hooks/useEmailBuilderRedux';
import { ComponentPalette } from './components/ComponentPalette';
import { EmailCanvas } from './components/EmailCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { EmailPreview } from './components/EmailPreview';

// Component type mapping for drag overlay
const componentTypeMap = {
	text: { name: __('Text', 'trigger'), icon: Type },
	heading: { name: __('Heading', 'trigger'), icon: Heading },
	button: { name: __('Button', 'trigger'), icon: MousePointer },
	image: { name: __('Image', 'trigger'), icon: Image },
	divider: { name: __('Divider', 'trigger'), icon: Minus },
	spacer: { name: __('Spacer', 'trigger'), icon: Space },
	social: { name: __('Social Links', 'trigger'), icon: Share2 },
	footer: { name: __('Footer', 'trigger'), icon: FileText },
};

// DragOverlay component to show while dragging
const DragOverlayComponent: React.FC<{ activeId: string | null }> = ({ activeId }) => {
	if (!activeId) return null;

	// Check if it's a component type (from palette)
	const componentInfo = componentTypeMap[activeId as keyof typeof componentTypeMap];

	if (componentInfo) {
		// Dragging from palette
		const Icon = componentInfo.icon;

		return (
			<Card className="w-64 shadow-lg border-2 border-blue-400 bg-blue-50 opacity-90">
				<CardContent className="p-4">
					<div className="flex items-center space-x-3">
						<div className="flex-shrink-0">
							<Icon className="w-6 h-6 text-blue-600" />
						</div>
						<div className="flex-1 min-w-0">
							<h4 className="text-sm font-medium text-blue-900 truncate">
								{componentInfo.name}
							</h4>
							<p className="text-xs text-blue-700 truncate">
								{__('Drag to canvas', 'trigger')}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	} else {
		// Dragging existing component - show a generic placeholder
		return (
			<Card className="w-64 shadow-lg border-2 border-green-400 bg-green-50 opacity-90">
				<CardContent className="p-4">
					<div className="flex items-center space-x-3">
						<div className="flex-shrink-0">
							<div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
								<span className="text-white text-xs font-bold">⋮⋮</span>
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<h4 className="text-sm font-medium text-green-900 truncate">
								{__('Component', 'trigger')}
							</h4>
							<p className="text-xs text-green-700 truncate">
								{__('Reordering', 'trigger')}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}
};

const EmailBuilder: React.FC = () => {
	const [activeTab, setActiveTab] = useState('design');
	const [showPreview, setShowPreview] = useState(false);

	const {
		components,
		selectedComponent,
		activeId,
		addComponent,
		updateComponent,
		deleteComponent,
		selectComponent,
		reorderComponents,
		setActiveId,
		undo,
		redo,
		canUndo,
		canRedo,
		generateHTML,
		saveTemplate,
		loadTemplate
	} = useEmailBuilderRedux();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;

		// For palette items, set activeId to the component type for the overlay
		if (active.data.current?.type === 'palette-item') {
			setActiveId(active.data.current.componentType);
		} else {
			// For existing components, use the component id
			setActiveId(active.id as string);
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;

		// Only process palette items
		if (active.data.current?.type !== 'palette-item') {
			return;
		}

		if (!over) {
			console.log('No over target');
			return;
		}

		console.log('Drag over - over.id:', over.id, 'over.data:', over.data.current);

		// STRICT: Only allow drops on email-canvas or components
		const isEmailCanvas = over.id === 'email-canvas';
		const isComponent = over.data.current?.type === 'component';

		console.log('Is email canvas:', isEmailCanvas, 'Is component:', isComponent);

		if (!isEmailCanvas && !isComponent) {
			console.log('Invalid drop target - blocking');
			// Block the drop by returning early
			return;
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		console.log('Drag end - active:', active.data.current, 'over:', over?.id, over?.data?.current);
		setActiveId(null);

		if (!over) {
			console.log('No over target, returning');
			return;
		}

		// Handle dropping new components from palette
		if (active.data.current?.type === 'palette-item') {
			// STRICT VALIDATION: Must be exactly email-canvas or component
			const isEmailCanvas = over.id === 'email-canvas';
			const isComponent = over.data.current?.type === 'component';

			console.log('Drop validation - Canvas:', isEmailCanvas, 'Component:', isComponent);

			// Reject any drop that's not on canvas or component
			if (!isEmailCanvas && !isComponent) {
				console.log('REJECTED: Invalid drop target');
				return;
			}

			const componentType = active.data.current.componentType;
			console.log('Adding component:', componentType);

			// If dropping on a component, insert after that component
			if (isComponent && !isEmailCanvas) {
				const targetIndex = components.findIndex(c => c.id === over.id);
				addComponent(componentType, targetIndex + 1);
			} else if (isEmailCanvas) {
				// Drop at the end of the canvas
				addComponent(componentType);
			}
			return;
		}

		// Handle reordering existing components
		if (active.data.current?.type === 'component') {
			const activeIndex = components.findIndex(c => c.id === active.id);
			const overIndex = components.findIndex(c => c.id === over.id);

			if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
				reorderComponents(activeIndex, overIndex);
			}
		}
	};

	const handleSaveTemplate = async () => {
		const templateName = prompt(__('Enter template name:', 'trigger'));
		if (templateName) {
			await saveTemplate(templateName);
			// await saveTemplate(templateName, components);
		}
	};

	const handleLoadTemplate = async () => {
		// TODO: Implement template loading UI
		console.log('Load template');
	};

	const handleExportHTML = () => {
		const html = generateHTML();
		const blob = new Blob([html], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'email-template.html';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	if (showPreview) {
		return (
			<div className="h-screen flex flex-col">
				<div className="border-b bg-white px-6 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-gray-900">
							{__('Email Preview', 'trigger')}
						</h1>
						<Button
							onClick={() => setShowPreview(false)}
							variant="outline"
						>
							{__('Back to Editor', 'trigger')}
						</Button>
					</div>
				</div>
				<EmailPreview html={generateHTML()} />
			</div>
		);
	}

	return (
		<div className=" h-screen flex flex-col bg-gray-50">
			{/* Header */}
			<div className="border-b bg-white px-6 py-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-gray-900">
						{__('Email Builder', 'trigger')}
					</h1>

					<div className="flex items-center space-x-2">
						<Button
							onClick={undo}
							variant="outline"
							size="sm"
							disabled={!canUndo}
						>
							<Undo2 className="h-4 w-4" />
						</Button>

						<Button
							onClick={redo}
							variant="outline"
							size="sm"
							disabled={!canRedo}
						>
							<Redo2 className="h-4 w-4" />
						</Button>

						<div className="h-6 w-px bg-gray-300" />

						<Button
							onClick={handleSaveTemplate}
							variant="outline"
							size="sm"
							disabled={!components.length}
						>
							<Save className="h-4 w-4 mr-2" />
							{__('Save Template', 'trigger')}
						</Button>

						<Button
							onClick={handleLoadTemplate}
							variant="outline"
							size="sm"
						>
							<Upload className="h-4 w-4 mr-2" />
							{__('Load Template', 'trigger')}
						</Button>

						<Button
							onClick={handleExportHTML}
							variant="outline"
							size="sm"
							disabled={!components.length}
						>
							<Download className="h-4 w-4 mr-2" />
							{__('Export HTML', 'trigger')}
						</Button>

						<Button
							onClick={() => setShowPreview(true)}
							disabled={!components.length}
						>
							<Eye className="h-4 w-4 mr-2" />
							{__('Preview', 'trigger')}
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex overflow-hidden">
				<DndContext
					sensors={sensors}
					collisionDetection={pointerWithin}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					{/* Left Sidebar - Component Palette */}
					<div className="w-80 bg-white border-r">
						<div className="p-6">
							<Tabs value={activeTab} onValueChange={setActiveTab}>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="design" className="flex items-center">
										<Palette className="h-4 w-4 mr-2" />
										{__('Design', 'trigger')}
									</TabsTrigger>
									<TabsTrigger value="settings" className="flex items-center">
										<Settings className="h-4 w-4 mr-2" />
										{__('Settings', 'trigger')}
									</TabsTrigger>
								</TabsList>

								<TabsContent value="design" className="mt-6">
									<ComponentPalette />
								</TabsContent>

								<TabsContent value="settings" className="mt-6">
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												{__('Email Settings', 'trigger')}
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div>
												<label className="text-sm font-medium text-gray-700">
													{__('Email Width', 'trigger')}
												</label>
												<select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
													<option value="600">600px</option>
													<option value="800">800px</option>
													<option value="100%">100%</option>
												</select>
											</div>

											<div>
												<label className="text-sm font-medium text-gray-700">
													{__('Background Color', 'trigger')}
												</label>
												<input
													type="color"
													className="mt-1 block w-full h-10 rounded-md border-gray-300"
													defaultValue="#ffffff"
												/>
											</div>
										</CardContent>
									</Card>
								</TabsContent>
							</Tabs>
						</div>
					</div>

					{/* Center - Email Canvas */}
					<div className="flex-1 overflow-y-auto">
						<SortableContext
							items={components.map(c => c.id)}
							strategy={verticalListSortingStrategy}
						>
							<EmailCanvas
								components={components}
								selectedComponent={selectedComponent}
								onSelectComponent={selectComponent}
								onUpdateComponent={updateComponent}
								onDeleteComponent={deleteComponent}
							/>
						</SortableContext>
					</div>

					{/* Right Sidebar - Properties Panel */}
					<div className="w-80 bg-white border-l overflow-y-auto">
						<div className="p-6">
							<PropertiesPanel
								selectedComponent={selectedComponent}
								onUpdateComponent={updateComponent}
							/>
						</div>
					</div>

					{/* Drag Overlay */}
					<DragOverlay>
						<DragOverlayComponent activeId={activeId} />
					</DragOverlay>
				</DndContext>
			</div>
		</div>
	);
};

export default EmailBuilder;