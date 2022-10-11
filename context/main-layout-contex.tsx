import React, { useContext, useState } from 'react';

interface MainLayoutContextType {
    name: string;
    setName: (value: string) => void;
}

export const MainLayoutContext = React.createContext<MainLayoutContextType>({
    name: '',
    setName: (value: string) => {},
});

export const useMainLayout = () => useContext(MainLayoutContext);

interface Props {
    children: React.ReactNode | React.ReactNode[];
}

export const MainLayoutProvider = ({ children }: Props) => {
    const [name, setName] = useState('');

    return <MainLayoutContext.Provider value={{ name, setName }}>{children}</MainLayoutContext.Provider>;
};
