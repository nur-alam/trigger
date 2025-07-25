import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { EmailComponent } from '../types';
import { EmailComponentRenderer } from './EmailComponentRenderer';
import { __ } from '@wordpress/i18n';
import { Plus } from 'lucide-react';

interface EmailCanvasProps {
  components: EmailComponent[];
  selectedComponent: EmailComponent | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<EmailComponent>) => void;
  onDeleteComponent: (id: string) => void;
}

export const EmailCanvas: React.FC<EmailCanvasProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'email-canvas',
    data: {
      type: 'canvas'
    }
  });

  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div
          ref={setNodeRef}
          className={`
            bg-white shadow-lg rounded-lg min-h-[600px] relative
            ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
          `}
        >
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <Plus className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {__('Start Building Your Email', 'trigger')}
              </h3>
              <p className="text-center max-w-md">
                {__('Drag components from the left panel to start building your email template', 'trigger')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {components.map((component, index) => (
                <EmailComponentRenderer
                  key={component.id}
                  component={component}
                  isSelected={selectedComponent?.id === component.id}
                  onSelect={() => onSelectComponent(component.id)}
                  onUpdate={(updates: Partial<EmailComponent>) => onUpdateComponent(component.id, updates)}
                  onDelete={() => onDeleteComponent(component.id)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};