import { TEXT_ELEMENT } from './Text';
import { HEADING_ELEMENT } from './Heading';
import { BUTTON_ELEMENT } from './Button';
import { IMAGE_ELEMENT } from './Image';
import { DIVIDER_ELEMENT } from './Divider';
import { SOCIAL_ICONS_ELEMENT } from './SocialIcons';
import { EmailElement } from './types';

// Export all elements
export { TEXT_ELEMENT, HEADING_ELEMENT, BUTTON_ELEMENT, IMAGE_ELEMENT, DIVIDER_ELEMENT, SOCIAL_ICONS_ELEMENT };

// Export types
export * from './types';

// Typed elements array
export const ELEMENTS: EmailElement[] = [
    TEXT_ELEMENT,
    HEADING_ELEMENT,
    BUTTON_ELEMENT,
    IMAGE_ELEMENT,
    DIVIDER_ELEMENT,
    SOCIAL_ICONS_ELEMENT
];
