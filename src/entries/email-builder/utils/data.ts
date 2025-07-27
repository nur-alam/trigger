import {
	Square,
	Type,
	Image,
	Focus,
	Minus,
	Columns,
	Columns2,
	Columns3,
	Columns4,
	Layers,
	FileImage,
	Heading,
} from 'lucide-react';

// Mock data for email templates
export const mockEmailTemplates = [
	{
		id: '1',
		name: 'Welcome Email',
		subject: 'Welcome to our platform!',
		description: 'A warm welcome email for new users',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-15',
		updatedAt: '2024-01-20',
		author: 'John Doe',
		status: 'published',
		category: 'onboarding',
		opens: 1250,
		clicks: 89,
	},
	{
		id: '2',
		name: 'Newsletter Template',
		subject: 'Monthly Newsletter - January 2024',
		description: 'Monthly newsletter template with latest updates',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-10',
		updatedAt: '2024-01-18',
		author: 'Jane Smith',
		status: 'draft',
		category: 'newsletter',
		opens: 890,
		clicks: 45,
	},
	{
		id: '3',
		name: 'Product Launch',
		subject: 'Introducing our new product!',
		description: 'Announcement email for new product launch',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-08',
		updatedAt: '2024-01-16',
		author: 'Mike Johnson',
		status: 'published',
		category: 'marketing',
		opens: 2100,
		clicks: 156,
	},
	{
		id: '4',
		name: 'Password Reset',
		subject: 'Reset your password',
		description: 'Security email for password reset requests',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-05',
		updatedAt: '2024-01-14',
		author: 'Sarah Wilson',
		status: 'published',
		category: 'transactional',
		opens: 450,
		clicks: 23,
	},
	{
		id: '5',
		name: 'Order Confirmation',
		subject: 'Your order has been confirmed',
		description: 'Confirmation email for successful orders',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-03',
		updatedAt: '2024-01-12',
		author: 'Tom Brown',
		status: 'published',
		category: 'transactional',
		opens: 1800,
		clicks: 234,
	},
	{
		id: '6',
		name: 'Holiday Sale',
		subject: 'Special Holiday Offers - 50% Off!',
		description: 'Promotional email for holiday season sales',
		thumbnail: '/api/placeholder/300/200',
		createdAt: '2024-01-01',
		updatedAt: '2024-01-10',
		author: 'Lisa Davis',
		status: 'scheduled',
		category: 'promotional',
		opens: 3200,
		clicks: 412,
	},
];

export const mockEmailTemplateCategories = [
	{
		id: 'onboarding',
		name: 'Onboarding',
		description: 'Templates for welcome emails and onboarding processes',
	},
	{
		id: 'newsletter',
		name: 'Newsletter',
		description: 'Templates for monthly newsletters and digest emails',
	},
	{
		id: 'marketing',
		name: 'Marketing',
		description: 'Templates for marketing campaigns and announcements',
	},
	{
		id: 'transactional',
		name: 'Transactional',
		description: 'Templates for transactional emails and notifications',
	},
	{
		id: 'promotional',
		name: 'Promotional',
		description: 'Templates for promotional offers and sales',
	},
];

export const elements = [
	{ id: 'button', icon: Square, label: 'Button' },
	{ id: 'text', icon: Type, label: 'Text' },
	{ id: 'heading', icon: Heading, label: 'Heading' },
	{ id: 'image', icon: Image, label: 'Image' },
	{ id: 'logo', icon: Focus, label: 'Logo' },
	{ id: 'logo-header', icon: Square, label: 'Logo Header' },
	{ id: 'divider', icon: Minus, label: 'Divider' },
	{ id: 'social-icons', icon: Focus, label: 'Social Icons' },
];

export const mediaItems = [
	{ id: 'img1', name: 'hero-banner.jpg', type: 'image', size: '1.2 MB', url: '/placeholder-image.jpg' },
	{ id: 'img2', name: 'product-photo.png', type: 'image', size: '800 KB', url: '/placeholder-image.jpg' },
	{ id: 'vid1', name: 'intro-video.mp4', type: 'video', size: '5.4 MB', url: '/placeholder-video.mp4' },
	{ id: 'aud1', name: 'background-music.mp3', type: 'audio', size: '2.1 MB', url: '/placeholder-audio.mp3' },
];

export const layouts = [
	{ id: 'column', icon: Columns, label: 'Column' },
	{ id: '2-column', icon: Columns2, label: '2 Column' },
	{ id: '3-column', icon: Columns3, label: '3 Column' },
	{ id: '4-column', icon: Columns4, label: '4 Column' },
];

export const layers = [
	{ id: 'header', name: 'Header Section', type: 'section', visible: true },
	{ id: 'hero', name: 'Hero Image', type: 'image', visible: true },
	{ id: 'content', name: 'Main Content', type: 'text', visible: true },
	{ id: 'cta', name: 'Call to Action', type: 'button', visible: true },
	{ id: 'footer', name: 'Footer', type: 'section', visible: true },
];
export type TabType = 'elements' | 'layers' | 'media';
export const tabs = [
	{ id: 'elements' as TabType, label: 'Elements', icon: Square },
	{ id: 'layers' as TabType, label: 'Layers', icon: Layers },
	{ id: 'media' as TabType, label: 'Media', icon: FileImage },
];
