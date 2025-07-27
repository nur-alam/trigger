import React, { useRef, FocusEvent, useState } from 'react'

const CodeSnap = () => {
	const [value, setValue] = useState<string>('')
	const [finalValue, setFinalValue] = useState<string>('')
	function handleBlur(event: FocusEvent<HTMLInputElement>) {
		console.log('onblur');
		setFinalValue(value)
	}
	function handleClose() {
		console.log('onclose');
		setValue(finalValue);
	}
	return (
		<div>
			<div>Final value: {finalValue}</div>
			<input
				type="text"
				onChange={(e) => setValue(e.target.value)}
				value={value}
				onBlur={handleBlur}
			/>
			<button data-action="close" onMouseDown={handleClose}>
				x
			</button>
		</div>
	);
}

export default CodeSnap


// const CodeSnap = () => {
// 	const [value, setValue] = useState<string>('')
// 	const [finalValue, setFinalValue] = useState<string>('')
// 	function handleBlur(event: FocusEvent<HTMLInputElement>) {
// 		console.log('relatedTarget', event.relatedTarget);

// 		// if close button is clicked, do not set final value
// 		if ((event.relatedTarget as HTMLElement)?.dataset?.action === "close") return
// 		// onBlur logic here
// 		setFinalValue(value)
// 	}
// 	function handleClose() {
// 		setValue(finalValue)
// 	}
// 	return (
// 		<div>
// 			<div>Final value: {finalValue}</div>
// 			<input
// 				type="text"
// 				placeholder="Paste your code here"
// 				onChange={(e) => setValue(e.target.value)}
// 				value={value}
// 				onBlur={handleBlur}
// 			/>
// 			<button data-action="close" onClick={handleClose}>
// 				x
// 			</button>
// 			<div className='mt-5 ml-5 p-2 bg-red-200 cursor-pointer'
// 				tabIndex={0}
// 				onMouseEnter={() => console.log('mouseenter')}>Click</div>
// 		</div>
// 	);
// }
