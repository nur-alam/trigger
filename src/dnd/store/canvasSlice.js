const { createSlice } = require('@reduxjs/toolkit');
const { HEADING, TEXT } = require('../elements');

const canvasSlice = createSlice({
	name: 'canvas',
	initialState: {
		elements: [],
		// elements: [HEADING, TEXT],
		selectedElements: [],
		undoStack: [],
		redoStack: [],
	},
	reducers: {
		addElement: (state, action) => {
			// state.undoStack.push([...state.elements]);
			// state.redoStack = [];
			// state.selectedElement = action.payload;
			state.elements.push(action.payload);
		},
		updateElement: (state, action) => {
			const { index, updatedObj } = action.payload;
			// state.undoStack.push([...state.elements]);
			// state.redoStack = [];
			state.elements[index] = { ...state.elements[index], ...updatedObj };
		},
		deleteElement: (state, action) => {
			// state.undoStack.push([...state.elements]);
			// state.redoStack = [];
			state.elements.splice(action.payload, 1);
		},
		updateSelectedElement: (state, action) => {
			state.selectedElements = action.payload;
		},
		undo: (state) => {
			if (state.undoStack.length > 0) {
				const previousState = state.undoStack.pop();
				state.redoStack.push([...state.elements]);
				state.elements = previousState;
			}
		},
		redo: (state) => {
			if (state.redoStack.length > 0) {
				const nextState = state.redoStack.pop();
				state.undoStack.push([...state.elements]);
				state.elements = nextState;
			}
		},
	},
});
export const { addElement, updateElement, deleteElement, updateSelectedElement, undo, redo } = canvasSlice.actions;
export default canvasSlice.reducer;
// module.exports = canvasSlice.reducer;
// module.exports.canvasActions = canvasSlice.actions;
