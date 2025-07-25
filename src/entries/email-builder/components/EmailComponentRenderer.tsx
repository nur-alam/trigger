import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EmailComponent } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { __ } from '@wordpress/i18n';
import { 
  GripVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface EmailComponentRendererProps {
  component: EmailComponent;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<EmailComponent>) => void;
  onDelete: () => void;
  index: number;
}

export const EmailComponentRenderer: React.FC<EmailComponentRendererProps> = ({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: component.id,
    data: {
      type: 'component',
      component
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderComponent = () => {
    const { props } = component;
    
    switch (component.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: props.fontSize,
              color: props.color,
              textAlign: props.textAlign,
              fontFamily: props.fontFamily,
              lineHeight: props.lineHeight,
              padding: props.padding
            }}
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        );

      case 'heading':
        const HeadingTag = props.level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return React.createElement(
          HeadingTag,
          {
            style: {
              fontSize: props.fontSize,
              color: props.color,
              textAlign: props.textAlign,
              fontFamily: props.fontFamily,
              fontWeight: props.fontWeight,
              padding: props.padding,
              margin: 0
            }
          },
          props.content
        );

      case 'button':
        return (
          <div style={{ textAlign: props.textAlign, margin: props.margin }}>
            <a
              href={props.url}
              style={{
                display: 'inline-block',
                backgroundColor: props.backgroundColor,
                color: props.textColor,
                padding: props.padding,
                textDecoration: 'none',
                borderRadius: props.borderRadius,
                fontSize: props.fontSize
              }}
            >
              {props.text}
            </a>
          </div>
        );

      case 'image':
        return (
          <div style={{ textAlign: props.textAlign, padding: props.padding }}>
            {props.src ? (
              <img
                src={props.src}
                alt={props.alt}
                style={{
                  width: props.width,
                  height: props.height,
                  maxWidth: '100%'
                }}
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-8 text-center">
                <p className="text-gray-500">{__('No image selected', 'trigger')}</p>
              </div>
            )}
          </div>
        );

      case 'divider':
        return (
          <hr
            style={{
              height: props.height,
              backgroundColor: props.backgroundColor,
              border: 'none',
              margin: props.margin
            }}
          />
        );

      case 'spacer':
        return <div style={{ height: props.height }} />;

      case 'social':
        return (
          <div style={{ textAlign: props.textAlign, padding: props.padding }}>
            <div style={{ display: 'inline-flex', gap: props.spacing }}>
              {props.platforms.map((platform: string) => (
                <a
                  key={platform}
                  href="#"
                  style={{
                    display: 'inline-block',
                    width: props.iconSize,
                    height: props.iconSize,
                    backgroundColor: '#ccc',
                    borderRadius: '4px'
                  }}
                  title={platform}
                >
                  {platform.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        );

      case 'footer':
        return (
          <div
            style={{
              fontSize: props.fontSize,
              color: props.color,
              textAlign: props.textAlign,
              padding: props.padding,
              backgroundColor: props.backgroundColor
            }}
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        );

      default:
        return <div>Unknown component type: {component.type}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Component Content */}
      <div className="relative">
        {renderComponent()}
      </div>

      {/* Toolbar */}
      {(isHovered || isSelected) && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white shadow-lg rounded-md border p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Component Label */}
      {isSelected && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-md">
          {component.type}
        </div>
      )}
    </div>
  );
};