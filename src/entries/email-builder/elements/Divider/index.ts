import { Minus } from 'lucide-react';
import DividerComponent from './DividerComponent';
import { v4 as uuidv4 } from 'uuid';
import { DividerElement } from '../types';

export const DIVIDER_ELEMENT: DividerElement = {
    id: uuidv4(),
    type: 'DIVIDER',
    label: 'Divider',
    icon: Minus,
    component: DividerComponent,
    style: {
        dimensions: {
            width: '100%',
            height: 1,
        },
        color: {
            backgroundColor: '#e0e0e0',
        },
        spacing: {
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 0,
            marginRight: 0,
        },
        alignment: 'center',
    },
};