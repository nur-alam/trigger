import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
	addComponent as addComponentAction,
	updateComponent as updateComponentAction,
	deleteComponent as deleteComponentAction,
	reorderComponents as reorderComponentsAction,
	selectComponent as selectComponentAction,
	setActiveId as setActiveIdAction,
	undo as undoAction,
	redo as redoAction,
	loadTemplate as loadTemplateAction,
	clearComponents as clearComponentsAction,
} from '../../../store/slices/emailBuilderSlice';
import {
	saveTemplateAsync,
	loadTemplateAsync,
	fetchTemplatesAsync,
} from '../../../store/thunks/emailBuilderThunks';
import {
	selectComponents,
	selectSelectedComponent,
	selectActiveId,
	selectCanUndo,
	selectCanRedo,
	selectIsLoading,
	selectError,
} from '../../../store/selectors/emailBuilderSelectors';
import { EmailComponent } from '../types';

export const useEmailBuilderRedux = () => {
	const dispatch = useAppDispatch();
	
	// Selectors
	const components = useAppSelector(selectComponents);
	const selectedComponent = useAppSelector(selectSelectedComponent);
	const activeId = useAppSelector(selectActiveId);
	const canUndo = useAppSelector(selectCanUndo);
	const canRedo = useAppSelector(selectCanRedo);
	const isLoading = useAppSelector(selectIsLoading);
	const error = useAppSelector(selectError);

	// Actions
	const addComponent = useCallback(
		(type: string, insertIndex?: number) => {
			dispatch(addComponentAction({ type, insertIndex }));
		},
		[dispatch]
	);

	const updateComponent = useCallback(
		(id: string, updates: Partial<EmailComponent>) => {
			dispatch(updateComponentAction({ id, updates }));
		},
		[dispatch]
	);

	const deleteComponent = useCallback(
		(id: string) => {
			dispatch(deleteComponentAction(id));
		},
		[dispatch]
	);

	const reorderComponents = useCallback(
		(activeIndex: number, overIndex: number) => {
			dispatch(reorderComponentsAction({ activeIndex, overIndex }));
		},
		[dispatch]
	);

	const selectComponent = useCallback(
		(id: string | null) => {
			dispatch(selectComponentAction(id));
		},
		[dispatch]
	);

	const setActiveId = useCallback(
		(id: string | null) => {
			dispatch(setActiveIdAction(id));
		},
		[dispatch]
	);

	const undo = useCallback(() => {
		dispatch(undoAction());
	}, [dispatch]);

	const redo = useCallback(() => {
		dispatch(redoAction());
	}, [dispatch]);

	const loadTemplate = useCallback(
		(templateComponents: EmailComponent[]) => {
			dispatch(loadTemplateAction(templateComponents));
		},
		[dispatch]
	);

	const clearComponents = useCallback(() => {
		dispatch(clearComponentsAction());
	}, [dispatch]);

	const generateHTML = useCallback(() => {
		return generateEmailHTML(components);
	}, [components]);

	// Template operations (async)
	const saveTemplate = useCallback(async (name: string) => {
		try {
			await dispatch(saveTemplateAsync({ name, components })).unwrap();
			return true;
		} catch (error) {
			console.error('Failed to save template:', error);
			return false;
		}
	}, [dispatch, components]);

	const loadTemplateById = useCallback(async (templateId: string) => {
		try {
			await dispatch(loadTemplateAsync(templateId)).unwrap();
			return true;
		} catch (error) {
			console.error('Failed to load template:', error);
			return false;
		}
	}, [dispatch]);

	const fetchTemplates = useCallback(async () => {
		try {
			const result = await dispatch(fetchTemplatesAsync()).unwrap();
			return result;
		} catch (error) {
			console.error('Failed to fetch templates:', error);
			return [];
		}
	}, [dispatch]);

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
		canUndo,
		canRedo,
		generateHTML,
		saveTemplate,
		loadTemplate: loadTemplateById,
		loadTemplateComponents: loadTemplate,
		clearComponents,
		fetchTemplates,
		isLoading,
		error,
	};
};

const generateEmailHTML = (components: EmailComponent[]): string => {
	const componentHTML = components
		.map((component) => {
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
		})
		.join('');

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