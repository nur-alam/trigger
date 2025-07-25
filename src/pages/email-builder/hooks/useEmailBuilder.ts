import { useState, useCallback } from 'react';
import { EmailComponent, HistoryState } from '../types';
import { generateUniqueId } from '../utils/helpers';

const MAX_HISTORY_SIZE = 50;

export const useEmailBuilder = () => {
  const [components, setComponents] = useState<EmailComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const selectedComponent = components.find(c => c.id === selectedComponentId) || null;

  const saveToHistory = useCallback((newComponents: EmailComponent[], newSelectedId: string | null) => {
    const newState: HistoryState = {
      components: JSON.parse(JSON.stringify(newComponents)),
      selectedComponentId: newSelectedId
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addComponent = useCallback((type: string) => {
    const newComponent: EmailComponent = {
      id: generateUniqueId(),
      type,
      props: getDefaultPropsForType(type)
    };

    const newComponents = [...components, newComponent];
    saveToHistory(newComponents, newComponent.id);
    setComponents(newComponents);
    setSelectedComponentId(newComponent.id);
  }, [components, saveToHistory]);

  const updateComponent = useCallback((id: string, updates: Partial<EmailComponent>) => {
    const newComponents = components.map(component =>
      component.id === id ? { ...component, ...updates } : component
    );
    
    saveToHistory(newComponents, selectedComponentId);
    setComponents(newComponents);
  }, [components, selectedComponentId, saveToHistory]);

  const deleteComponent = useCallback((id: string) => {
    const newComponents = components.filter(component => component.id !== id);
    const newSelectedId = selectedComponentId === id ? null : selectedComponentId;
    
    saveToHistory(newComponents, newSelectedId);
    setComponents(newComponents);
    setSelectedComponentId(newSelectedId);
  }, [components, selectedComponentId, saveToHistory]);

  const reorderComponents = useCallback((activeIndex: number, overIndex: number) => {
    const newComponents = [...components];
    const [removed] = newComponents.splice(activeIndex, 1);
    newComponents.splice(overIndex, 0, removed);
    
    saveToHistory(newComponents, selectedComponentId);
    setComponents(newComponents);
  }, [components, selectedComponentId, saveToHistory]);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setComponents(prevState.components);
      setSelectedComponentId(prevState.selectedComponentId);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setComponents(nextState.components);
      setSelectedComponentId(nextState.selectedComponentId);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const generateHTML = useCallback(() => {
    return generateEmailHTML(components);
  }, [components]);

  const saveTemplate = useCallback(async (name: string, templateComponents: EmailComponent[]) => {
    // TODO: Implement template saving to WordPress database
    console.log('Saving template:', name, templateComponents);
  }, []);

  const loadTemplate = useCallback(async (templateId: string) => {
    // TODO: Implement template loading from WordPress database
    console.log('Loading template:', templateId);
  }, []);

  return {
    components,
    selectedComponent,
    activeId,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
    selectComponent,
    setActiveId,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    generateHTML,
    saveTemplate,
    loadTemplate
  };
};

const getDefaultPropsForType = (type: string): Record<string, any> => {
  const defaults: Record<string, Record<string, any>> = {
    text: {
      content: 'Your text here...',
      fontSize: '16px',
      color: '#333333',
      textAlign: 'left',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.5',
      padding: '16px'
    },
    heading: {
      content: 'Your heading here',
      level: 'h2',
      fontSize: '24px',
      color: '#333333',
      textAlign: 'left',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      padding: '16px'
    },
    button: {
      text: 'Click Here',
      url: '#',
      backgroundColor: '#007cba',
      textColor: '#ffffff',
      borderRadius: '4px',
      padding: '12px 24px',
      fontSize: '16px',
      textAlign: 'center',
      margin: '16px'
    },
    image: {
      src: '',
      alt: 'Image',
      width: '100%',
      height: 'auto',
      textAlign: 'center',
      padding: '16px'
    },
    divider: {
      height: '1px',
      backgroundColor: '#e0e0e0',
      margin: '20px 0'
    },
    spacer: {
      height: '20px'
    },
    social: {
      platforms: ['facebook', 'twitter', 'instagram'],
      iconSize: '32px',
      spacing: '10px',
      textAlign: 'center',
      padding: '16px'
    },
    footer: {
      content: 'Copyright © 2024 Your Company. All rights reserved.',
      fontSize: '12px',
      color: '#666666',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f8f8f8'
    }
  };

  return defaults[type] || {};
};

const generateEmailHTML = (components: EmailComponent[]): string => {
  const componentHTML = components.map(component => {
    switch (component.type) {
      case 'text':
        return `<div style="font-size: ${component.props.fontSize}; color: ${component.props.color}; text-align: ${component.props.textAlign}; font-family: ${component.props.fontFamily}; line-height: ${component.props.lineHeight}; padding: ${component.props.padding};">${component.props.content}</div>`;
      
      case 'heading':
        return `<${component.props.level} style="font-size: ${component.props.fontSize}; color: ${component.props.color}; text-align: ${component.props.textAlign}; font-family: ${component.props.fontFamily}; font-weight: ${component.props.fontWeight}; padding: ${component.props.padding}; margin: 0;">${component.props.content}</${component.props.level}>`;
      
      case 'button':
        return `<div style="text-align: ${component.props.textAlign}; margin: ${component.props.margin};"><a href="${component.props.url}" style="display: inline-block; background-color: ${component.props.backgroundColor}; color: ${component.props.textColor}; padding: ${component.props.padding}; text-decoration: none; border-radius: ${component.props.borderRadius}; font-size: ${component.props.fontSize};">${component.props.text}</a></div>`;
      
      case 'image':
        return `<div style="text-align: ${component.props.textAlign}; padding: ${component.props.padding};"><img src="${component.props.src}" alt="${component.props.alt}" style="width: ${component.props.width}; height: ${component.props.height}; max-width: 100%;" /></div>`;
      
      case 'divider':
        return `<hr style="height: ${component.props.height}; background-color: ${component.props.backgroundColor}; border: none; margin: ${component.props.margin};" />`;
      
      case 'spacer':
        return `<div style="height: ${component.props.height};"></div>`;
      
      case 'footer':
        return `<div style="font-size: ${component.props.fontSize}; color: ${component.props.color}; text-align: ${component.props.textAlign}; padding: ${component.props.padding}; background-color: ${component.props.backgroundColor};">${component.props.content}</div>`;
      
      default:
        return '';
    }
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          ${componentHTML}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
};