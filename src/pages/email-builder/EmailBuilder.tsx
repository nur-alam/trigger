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
} from 'lucide-react';

import { useEmailBuilder } from './hooks/useEmailBuilder';
import { ComponentPalette } from './components/ComponentPalette';
import { EmailCanvas } from './components/EmailCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { EmailPreview } from './components/EmailPreview';

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
		generateHTML,
		saveTemplate,
		loadTemplate
	} = useEmailBuilder();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
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
			await saveTemplate(templateName, components);
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
							disabled={!components.length}
						>
							<Undo2 className="h-4 w-4" />
						</Button>

						<Button
							onClick={redo}
							variant="outline"
							size="sm"
							disabled={!components.length}
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
				</DndContext>
			</div>
		</div>
	);
};

export default EmailBuilder;