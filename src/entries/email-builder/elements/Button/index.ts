import { MousePointer } from 'lucide-react';
import ButtonComponent from './ButtonComponent';
import { v4 as uuidv4 } from 'uuid';
import { ButtonElement } from '../types';

export const BUTTON_ELEMENT: ButtonElement = {
    id: uuidv4(),
    type: 'BUTTON',
    label: 'Button',
    icon: MousePointer,
    component: ButtonComponent,
    content: 'Click Me',
    href: '#',
    style: {
        typography: {
            family: 'Lexend',
            type: 'sans-serif',
            fontUrl: '',
            height: 1.4,
            weight: 600,
            spacing: 0,
            size: 16,
        },
        color: {
            textColor: '#ffffff',
            backgroundColor: '#007cba',
        },
        border: {
            borderColor: '#007cba',
            borderWidth: 1,
            borderRadius: 4,
            borderStyle: 'solid',
        },
        spacing: {
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 24,
            paddingRight: 24,
        },
    },
};