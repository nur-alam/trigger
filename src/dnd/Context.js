const { createContext, useState } = require('react');

export const CanvasContext = createContext(null);

export const CanvasProvider = ({ children }) => {
	const [canvasElements, setCanvasElements] = useState([]);
	const addElement = (element) => {
		setCanvasElements((prev) => [...prev, element]);
	};

	/**
	 * @param {number} index - index of the element to update
	 * @param {object} updates - updates to be applied to the element
	 */
	const updateElement = (index, data) => {
		if (index < 0 || index >= canvasElements.length) {
			console.error('Invalid index for updating element');
			return;
		}
		setCanvasElements((prev) => {
			const updatedElements = [...prev];
			updatedElements[index] = { ...updatedElements[index], ...data };
			return updatedElements;
		});
	};

	const deleteElement = (index) => {
		setCanvasElements((prev) => {
			const updatedElements = [...prev];
			updatedElements.splice(index, 1);
			return updatedElements;
		});
	};

	return (
		<CanvasContext.Provider
			value={{
				canvasElements,
				addElement,
				updateElement,
				deleteElement,
				setCanvasElements,
			}}
		>
			{children}
		</CanvasContext.Provider>
	);
};
