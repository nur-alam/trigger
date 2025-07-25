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
            bg-white shadow-lg rounded-lg min-h-[600px] relative transition-all duration-200
            ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50' : ''}
          `}
        >
          {/* Drop zone indicator when dragging over empty canvas */}
          {isOver && components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-75 rounded-lg border-2 border-dashed border-blue-300">
              <div className="text-center">
                <Plus className="w-12 h-12 mx-auto mb-2 text-blue-400" />
                <p className="text-blue-600 font-medium">
                  {__('Drop component here', 'trigger')}
                </p>
              </div>
            </div>
          )}
          
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