export interface EmailComponent {
	id: string;
	type: string;
	props: Record<string, any>;
	children?: EmailComponent[];
}

export interface ComponentDefinition {
	type: string;
	label: string;
	icon: React.ComponentType<any>;
	category: 'content' | 'layout' | 'interactive' | 'media';
	defaultProps: Record<string, any>;
}

export interface EmailTemplate {
	id: string;
	name: string;
	components: EmailComponent[];
	createdAt: Date;
	updatedAt: Date;
}

export interface DragItem {
	type: string;
	id?: string;
	componentType?: string;
}

export interface HistoryState {
	components: EmailComponent[];
	selectedComponentId: string | null;
}
