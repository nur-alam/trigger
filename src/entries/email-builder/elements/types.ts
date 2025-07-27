import { ComponentType } from 'react';
import { LucideIcon } from 'lucide-react';

// Base style interfaces
export interface Dimensions {
    width?: number | string;
    height?: number | string;
    maxWidth?: string;
    iconSize?: number;
}

export interface Typography {
    family?: string;
    type?: string;
    fontUrl?: string;
    height?: number;
    weight?: number;
    spacing?: number;
    size?: number;
}

export interface Color {
    textColor?: string;
    backgroundColor?: string;
}

export interface Border {
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    borderStyle?: string;
}

export interface Spacing {
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    iconSpacing?: number;
}

// Base style interface that all elements can use
export interface BaseStyle {
    dimensions?: Dimensions;
    typography?: Typography;
    color?: Color;
    border?: Border;
    spacing?: Spacing;
    alignment?: 'left' | 'center' | 'right';
}

// Social icon interface
export interface SocialIcon {
    platform: string;
    url: string;
    icon: string;
}

// Base element interface
export interface BaseElement {
    id: string;
    type: string;
    label: string;
    icon: LucideIcon;
    component: ComponentType<any>;
    style: BaseStyle;
}

// Specific element interfaces with their unique properties
export interface TextElement extends BaseElement {
    type: 'TEXT';
    content: string;
}

export interface HeadingElement extends BaseElement {
    type: 'HEADING';
    content: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ButtonElement extends BaseElement {
    type: 'BUTTON';
    content: string;
    href: string;
}

export interface ImageElement extends BaseElement {
    type: 'IMAGE';
    src: string;
    alt: string;
}

export interface DividerElement extends BaseElement {
    type: 'DIVIDER';
}

export interface SocialIconsElement extends BaseElement {
    type: 'SOCIAL_ICONS';
    icons: SocialIcon[];
}

// Union type for all elements
export type EmailElement =
    | TextElement
    | HeadingElement
    | ButtonElement
    | ImageElement
    | DividerElement
    | SocialIconsElement;

// Generic element creator function type
export type ElementCreator<T extends EmailElement> = () => T;

// Helper type to extract element-specific properties
export type ElementProps<T extends EmailElement> = Omit<T, keyof BaseElement>;

// Type guard functions
export const isTextElement = (element: EmailElement): element is TextElement =>
    element.type === 'TEXT';

export const isHeadingElement = (element: EmailElement): element is HeadingElement =>
    element.type === 'HEADING';

export const isButtonElement = (element: EmailElement): element is ButtonElement =>
    element.type === 'BUTTON';

export const isImageElement = (element: EmailElement): element is ImageElement =>
    element.type === 'IMAGE';

export const isDividerElement = (element: EmailElement): element is DividerElement =>
    element.type === 'DIVIDER';

export const isSocialIconsElement = (element: EmailElement): element is SocialIconsElement =>
    element.type === 'SOCIAL_ICONS';