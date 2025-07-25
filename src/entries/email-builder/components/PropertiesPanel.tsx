import React, { useState } from 'react';
import { EmailComponent } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { __ } from '@wordpress/i18n';
import { Settings, Palette, Layout } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponent: EmailComponent | null;
  onUpdateComponent: (id: string, updates: Partial<EmailComponent>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateComponent
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('content');

  if (!selectedComponent) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {__('No Component Selected', 'trigger')}
              </h3>
              <p className="text-sm">
                {__('Select a component from the canvas to edit its properties', 'trigger')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateProps = (newProps: Record<string, any>) => {
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, ...newProps }
    });
  };

  const renderContentTab = () => {
    const { props } = selectedComponent;

    switch (selectedComponent.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">{__('Content', 'trigger')}</Label>
              <Textarea
                id="content"
                value={props.content || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateProps({ content: e.target.value })}
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">{__('Heading Text', 'trigger')}</Label>
              <Input
                id="content"
                value={props.content || ''}
                onChange={(e) => updateProps({ content: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="level">{__('Heading Level', 'trigger')}</Label>
              <Select value={props.level} onValueChange={(value) => updateProps({ level: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="h5">H5</SelectItem>
                  <SelectItem value="h6">H6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">{__('Button Text', 'trigger')}</Label>
              <Input
                id="text"
                value={props.text || ''}
                onChange={(e) => updateProps({ text: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="url">{__('Link URL', 'trigger')}</Label>
              <Input
                id="url"
                value={props.url || ''}
                onChange={(e) => updateProps({ url: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">{__('Image URL', 'trigger')}</Label>
              <Input
                id="src"
                value={props.src || ''}
                onChange={(e) => updateProps({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="alt">{__('Alt Text', 'trigger')}</Label>
              <Input
                id="alt"
                value={props.alt || ''}
                onChange={(e) => updateProps({ alt: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">{__('Footer Content', 'trigger')}</Label>
              <Textarea
                id="content"
                value={props.content || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateProps({ content: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            {__('No content options available for this component', 'trigger')}
          </div>
        );
    }
  };

  const renderStyleTab = () => {
    const { props } = selectedComponent;

    return (
      <div className="space-y-4">
        {/* Font Size */}
        {['text', 'heading', 'button', 'footer'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="fontSize">{__('Font Size', 'trigger')}</Label>
            <Input
              id="fontSize"
              value={props.fontSize || ''}
              onChange={(e) => updateProps({ fontSize: e.target.value })}
              placeholder="16px"
              className="mt-1"
            />
          </div>
        )}

        {/* Text Color */}
        {['text', 'heading', 'footer'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="color">{__('Text Color', 'trigger')}</Label>
            <div className="flex mt-1">
              <Input
                id="color"
                type="color"
                value={props.color || '#333333'}
                onChange={(e) => updateProps({ color: e.target.value })}
                className="w-16 h-10 p-1 mr-2"
              />
              <Input
                value={props.color || '#333333'}
                onChange={(e) => updateProps({ color: e.target.value })}
                placeholder="#333333"
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* Background Color */}
        {['button', 'footer'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="backgroundColor">{__('Background Color', 'trigger')}</Label>
            <div className="flex mt-1">
              <Input
                id="backgroundColor"
                type="color"
                value={props.backgroundColor || '#007cba'}
                onChange={(e) => updateProps({ backgroundColor: e.target.value })}
                className="w-16 h-10 p-1 mr-2"
              />
              <Input
                value={props.backgroundColor || '#007cba'}
                onChange={(e) => updateProps({ backgroundColor: e.target.value })}
                placeholder="#007cba"
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* Text Alignment */}
        {['text', 'heading', 'button', 'image', 'footer'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="textAlign">{__('Text Alignment', 'trigger')}</Label>
            <Select value={props.textAlign} onValueChange={(value) => updateProps({ textAlign: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">{__('Left', 'trigger')}</SelectItem>
                <SelectItem value="center">{__('Center', 'trigger')}</SelectItem>
                <SelectItem value="right">{__('Right', 'trigger')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Padding */}
        <div>
          <Label htmlFor="padding">{__('Padding', 'trigger')}</Label>
          <Input
            id="padding"
            value={props.padding || ''}
            onChange={(e) => updateProps({ padding: e.target.value })}
            placeholder="16px"
            className="mt-1"
          />
        </div>
      </div>
    );
  };

  const renderLayoutTab = () => {
    const { props } = selectedComponent;

    return (
      <div className="space-y-4">
        {/* Width */}
        {['image'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="width">{__('Width', 'trigger')}</Label>
            <Input
              id="width"
              value={props.width || ''}
              onChange={(e) => updateProps({ width: e.target.value })}
              placeholder="100%"
              className="mt-1"
            />
          </div>
        )}

        {/* Height */}
        {['image', 'spacer', 'divider'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="height">{__('Height', 'trigger')}</Label>
            <Input
              id="height"
              value={props.height || ''}
              onChange={(e) => updateProps({ height: e.target.value })}
              placeholder="auto"
              className="mt-1"
            />
          </div>
        )}

        {/* Margin */}
        {['button', 'divider'].includes(selectedComponent.type) && (
          <div>
            <Label htmlFor="margin">{__('Margin', 'trigger')}</Label>
            <Input
              id="margin"
              value={props.margin || ''}
              onChange={(e) => updateProps({ margin: e.target.value })}
              placeholder="16px"
              className="mt-1"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {__('Component Properties', 'trigger')}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {selectedComponent.type} {__('component', 'trigger')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-1" />
          {__('Content', 'trigger')}
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'style'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-1" />
          {__('Style', 'trigger')}
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'layout'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layout className="w-4 h-4 inline mr-1" />
          {__('Layout', 'trigger')}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'style' && renderStyleTab()}
        {activeTab === 'layout' && renderLayoutTab()}
      </div>
    </div>
  );
};