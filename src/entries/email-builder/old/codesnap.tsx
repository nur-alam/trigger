import React, { useRef, FocusEvent } from 'react'

const CodeSnap = () => {
	const inputRef = useRef(null);
	function handleBlur(e: FocusEvent<HTMLInputElement>) {
		if ((e.relatedTarget as HTMLElement)?.dataset?.action === "close") return;
		// onBlur logic here
	}
	function handleClose() {
		// close logic here
	}
	return (
		<div>
			<input
				ref={inputRef}
				onBlur={handleBlur}
				defaultValue="Edit"
			/>
			<button data-action="close" onClick={handleClose}>
				x
			</button>
		</div>
	);
}

export default CodeSnap
