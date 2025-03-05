import React, { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 300) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => {
			console.log('debounce', value);
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
