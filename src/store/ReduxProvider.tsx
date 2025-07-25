import React from 'react';

interface ReduxProviderProps {
	children: React.ReactNode;
}

export const ReduxProvider = ({ children }: ReduxProviderProps) => {
	// Mock Redux Provider for UI development
	return <>{children}</>;
};