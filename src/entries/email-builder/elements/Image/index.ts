import { Image } from 'lucide-react';
import ImageComponent from './ImageComponent';
import { v4 as uuidv4 } from 'uuid';
import { ImageElement } from '../types';

export const IMAGE_ELEMENT: ImageElement = {
    id: uuidv4(),
    type: 'IMAGE',
    label: 'Image',
    icon: Image,
    component: ImageComponent,
    src: 'https://via.placeholder.com/300x200',
    alt: 'Placeholder image',
    style: {
        dimensions: {
            width: 300,
            height: 200,
            maxWidth: '100%',
        },
        border: {
            borderColor: '#000000',
            borderWidth: 0,
            borderRadius: 0,
            borderStyle: 'solid',
        },
        spacing: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
        },
        alignment: 'left',
    },
};