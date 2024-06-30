import React, { createContext, useContext } from 'react';

interface SubstrateContextProps {
    substrateHeight: number;
    setSubstrateHeight: (value: number) => void;
    substrateWidth: number;
    setSubstrateWidth: (value: number) => void;
}

const SubstrateContext = createContext<SubstrateContextProps | undefined>(undefined);

interface SubstrateProviderProps {
    children: React.ReactNode;
}

const SubstrateProvider: React.FC<SubstrateProviderProps> = ({ children }) => {
    const [substrateHeight, setSubstrateHeight] = React.useState(450);
    const [substrateWidth, setSubstrateWidth] = React.useState(200);

    return (
        <SubstrateContext.Provider value={{ substrateHeight, setSubstrateHeight, substrateWidth, setSubstrateWidth }}>
            {children}
        </SubstrateContext.Provider>
    );
};

const useSubstrate = (): SubstrateContextProps => {
    const context = useContext(SubstrateContext);
    if (!context) {
        throw new Error('useSubstrate must be used within a SubstrateProvider');
    }
    return context;
};

export { SubstrateProvider, useSubstrate }