import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

export const useLocalStorage = <T>(
	key: string,
	initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.error("useLocalStorage parse error:", error);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(storedValue));
		} catch (error) {
			console.error("useLocalStorage set error:", error);
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
};
