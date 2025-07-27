import { v4 as uuidv4 } from 'uuid';
import {
    EmailElement,
    ImageElement,
    ButtonElement,
    TextElement,
    HeadingElement,
    DividerElement,
    SocialIconsElement,
    BaseStyle
} from './types';

// Helper function to create a new element with a fresh ID
export function cloneElement<T extends EmailElement>(element: T): T {
    return {
        ...element,
        id: uuidv4(),
    };
}

// Helper function to update element properties with type safety
export function updateElement<T extends EmailElement>(
    element: T,
    updates: Partial<Omit<T, 'id' | 'type' | 'label' | 'icon' | 'component'>>
): T {
    return {
        ...element,
        ...updates,
    };
}

// Helper function to update element style with deep merge
export function updateElementStyle<T extends EmailElement>(
    element: T,
    styleUpdates: Partial<BaseStyle>
): T {
    return {
        ...element,
        style: {
            ...element.style,
            ...styleUpdates,
            // Deep merge nested objects
            dimensions: styleUpdates.dimensions ?
                { ...element.style.dimensions, ...styleUpdates.dimensions } :
                element.style.dimensions,
            typography: styleUpdates.typography ?
                { ...element.style.typography, ...styleUpdates.typography } :
                element.style.typography,
            color: styleUpdates.color ?
                { ...element.style.color, ...styleUpdates.color } :
                element.style.color,
            border: styleUpdates.border ?
                { ...element.style.border, ...styleUpdates.border } :
                element.style.border,
            spacing: styleUpdates.spacing ?
                { ...element.style.spacing, ...styleUpdates.spacing } :
                element.style.spacing,
        },
    };
}

// Type-safe element property getters
export function getImageProps(element: ImageElement): { src: string; alt: string } {
    return { src: element.src, alt: element.alt };
}

export function getButtonProps(element: ButtonElement): { content: string; href: string } {
    return { content: element.content, href: element.href };
}

export function getTextProps(element: TextElement): { content: string } {
    return { content: element.content };
}

export function getHeadingProps(element: HeadingElement): { content: string; level?: number } {
    return { content: element.content, level: element.level };
}

export function getSocialIconsProps(element: SocialIconsElement) {
    return { icons: element.icons };
}

// Element factory functions with proper typing
export function createImageElement(overrides?: Partial<ImageElement>): ImageElement {
    return {
        id: uuidv4(),
        type: 'IMAGE',
        label: 'Image',
        icon: null as any, // Will be set by the actual element
        component: null as any, // Will be set by the actual element
        src: 'https://via.placeholder.com/300x200',
        alt: 'Placeholder image',
        style: {
            dimensions: { width: 300, height: 200, maxWidth: '100%' },
            border: { borderColor: '#000000', borderWidth: 0, borderRadius: 0, borderStyle: 'solid' },
            spacing: { marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 },
            alignment: 'left',
        },
        ...overrides,
    };
}

// Validation helpers
export function validateElement(element: EmailElement): boolean {
    if (!element.id || !element.type || !element.label) {
        return false;
    }

    switch (element.type) {
        case 'IMAGE':
            return !!(element as ImageElement).src && !!(element as ImageElement).alt;
        case 'BUTTON':
            return !!(element as ButtonElement).content && !!(element as ButtonElement).href;
        case 'TEXT':
        case 'HEADING':
            return !!(element as TextElement | HeadingElement).content;
        case 'SOCIAL_ICONS':
            return Array.isArray((element as SocialIconsElement).icons) &&
                (element as SocialIconsElement).icons.length > 0;
        case 'DIVIDER':
            return true; // Divider has no required extra properties
        default:
            return false;
    }
}