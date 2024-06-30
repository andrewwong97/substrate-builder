import React, { createContext, useContext } from 'react';

// Define the context
interface SubstrateContextProps {
    // Add your provider properties here
    substrateHeight: number;
    setSubstrateHeight: (value: number) => void;
    substrateWidth: number;
    setSubstrateWidth: (value: number) => void;
}

const SubstrateContext = createContext<SubstrateContextProps | undefined>(undefined);

// Define the provider component
interface SubstrateProviderProps {
    // Add your provider props here
    children: React.ReactNode;
}

const SubstrateProvider: React.FC<SubstrateProviderProps> = ({ children }) => {
    // Add your provider logic here
    const [substrateHeight, setSubstrateHeight] = React.useState(450);
    const [substrateWidth, setSubstrateWidth] = React.useState(200);

    return (
        <SubstrateContext.Provider value={{ substrateHeight, setSubstrateHeight, substrateWidth, setSubstrateWidth }}>
            {children}
        </SubstrateContext.Provider>
    );
};

// Custom hook to access the provider value
const useSubstrate = (): SubstrateContextProps => {
    const context = useContext(SubstrateContext);
    if (!context) {
        throw new Error('useSubstrate must be used within a SubstrateProvider');
    }
    return context;
};

export { SubstrateProvider, useSubstrate }