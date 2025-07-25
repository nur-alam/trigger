import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { __ } from '@wordpress/i18n';
import { 
  Type, 
  Heading, 
  MousePointer, 
  Image, 
  Minus, 
  Space, 
  Share2, 
  FileText 
} from 'lucide-react';

const componentTypes = [
  {
    type: 'text',
    name: __('Text', 'trigger'),
    icon: Type,
    category: 'content',
    description: __('Add text content', 'trigger')
  },
  {
    type: 'heading',
    name: __('Heading', 'trigger'),
    icon: Heading,
    category: 'content',
    description: __('Add heading text', 'trigger')
  },
  {
    type: 'button',
    name: __('Button', 'trigger'),
    icon: MousePointer,
    category: 'interactive',
    description: __('Add call-to-action button', 'trigger')
  },
  {
    type: 'image',
    name: __('Image', 'trigger'),
    icon: Image,
    category: 'media',
    description: __('Add image', 'trigger')
  },
  {
    type: 'divider',
    name: __('Divider', 'trigger'),
    icon: Minus,
    category: 'layout',
    description: __('Add horizontal divider', 'trigger')
  },
  {
    type: 'spacer',
    name: __('Spacer', 'trigger'),
    icon: Space,
    category: 'layout',
    description: __('Add vertical spacing', 'trigger')
  },
  {
    type: 'social',
    name: __('Social Links', 'trigger'),
    icon: Share2,
    category: 'interactive',
    description: __('Add social media links', 'trigger')
  },
  {
    type: 'footer',
    name: __('Footer', 'trigger'),
    icon: FileText,
    category: 'content',
    description: __('Add footer content', 'trigger')
  }
];

const categories = [
  { id: 'content', name: __('Content', 'trigger') },
  { id: 'layout', name: __('Layout', 'trigger') },
  { id: 'interactive', name: __('Interactive', 'trigger') },
  { id: 'media', name: __('Media', 'trigger') }
];

interface DraggableComponentProps {
  type: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ 
  type, 
  name, 
  icon: Icon, 
  description 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: type,
    data: {
      type: 'palette-item',
      componentType: type
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="hover:shadow-md transition-shadow duration-200 border-2 border-transparent hover:border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ComponentPalette: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {__('Email Components', 'trigger')}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {__('Drag components to the canvas to build your email', 'trigger')}
        </p>
      </div>

      {categories.map(category => {
        const categoryComponents = componentTypes.filter(comp => comp.category === category.id);
        
        if (categoryComponents.length === 0) return null;

        return (
          <div key={category.id} className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              {category.name}
            </h4>
            <div className="space-y-2">
              {categoryComponents.map(component => (
                <DraggableComponent
                  key={component.type}
                  type={component.type}
                  name={component.name}
                  icon={component.icon}
                  description={component.description}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};