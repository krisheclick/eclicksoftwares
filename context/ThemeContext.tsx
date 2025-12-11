"use client"
import { createContext, ReactNode, useContext, useState } from 'react';

type ThemeData = {
    headerExtraClass: string | null,
    setHeaderExtraClass:(headerExtraClass:string | null)=>void;

    
}

export const ThemeContext = createContext<ThemeData | undefined>(undefined);

export const ThemeProvider = ({children} : {children: ReactNode}) => {
    const [headerExtraClass, setHeaderExtraClass] = useState<string| null>(null);
    return(
        <ThemeContext.Provider value={{headerExtraClass,setHeaderExtraClass}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () : ThemeData => {
    const useThemeContext = useContext(ThemeContext);
    if(!useThemeContext){
        throw new Error("ThemeProvider must be use on layout.tsx children wrapper");
    }
    return useThemeContext;
}