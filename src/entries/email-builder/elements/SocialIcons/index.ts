import { Share2 } from 'lucide-react';
import SocialIconsComponent from './SocialIconsComponent';
import { v4 as uuidv4 } from 'uuid';
import { SocialIconsElement } from '../types';

export const SOCIAL_ICONS_ELEMENT: SocialIconsElement = {
    id: uuidv4(),
    type: 'SOCIAL_ICONS',
    label: 'Social Icons',
    icon: Share2,
    component: SocialIconsComponent,
    icons: [
        {
            platform: 'facebook',
            url: 'https://facebook.com',
            icon: 'https://cdn-icons-png.flaticon.com/32/124/124010.png',
        },
        {
            platform: 'twitter',
            url: 'https://twitter.com',
            icon: 'https://cdn-icons-png.flaticon.com/32/124/124021.png',
        },
        {
            platform: 'instagram',
            url: 'https://instagram.com',
            icon: 'https://cdn-icons-png.flaticon.com/32/124/124024.png',
        },
        {
            platform: 'linkedin',
            url: 'https://linkedin.com',
            icon: 'https://cdn-icons-png.flaticon.com/32/124/124011.png',
        },
    ],
    style: {
        dimensions: {
            iconSize: 32,
        },
        spacing: {
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 0,
            marginRight: 0,
            iconSpacing: 10,
        },
        alignment: 'center',
    },
};