import React, { createContext, useContext, useState} from 'react';

interface SubstrateContextProps {
    substrateHeight: number;
    setSubstrateHeight: (value: number) => void;
    substrateWidth: number;
    setSubstrateWidth: (value: number) => void;
    file: File | null;
    setFile: (file: File) => void;
}

const SubstrateContext = createContext<SubstrateContextProps | undefined>(undefined);

interface SubstrateProviderProps {
    children: React.ReactNode;
}

const SubstrateProvider: React.FC<SubstrateProviderProps> = ({ children }) => {
    const [substrateHeight, setSubstrateHeight] = useState<number>(450);
    const [substrateWidth, setSubstrateWidth] = useState<number>(200);
    const [file, setFile] = useState<File | null>(null);

    return (
        <SubstrateContext.Provider 
            value={{ 
                substrateHeight, 
                setSubstrateHeight, 
                substrateWidth, 
                setSubstrateWidth,
                file,
                setFile
        }}>
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