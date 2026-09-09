"use client";
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
const ThemeContext=createContext(null);
const KEY='teklms-theme';
export function ThemeProvider({children}){
  const[theme,setTheme]=useState('dark');
  const[ready,setReady]=useState(false);
  useEffect(()=>{
    const saved=localStorage.getItem(KEY);
    const resolved=saved==='dark'||saved==='light'?saved:'dark';
    setTheme(resolved);document.documentElement.dataset.theme=resolved;setReady(true);
  },[]);
  useEffect(()=>{if(!ready)return;document.documentElement.dataset.theme=theme;localStorage.setItem(KEY,theme)},[theme,ready]);
  const value=useMemo(()=>({theme,setTheme,toggleTheme:()=>setTheme(t=>t==='dark'?'light':'dark'),ready}),[theme,ready]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme(){const ctx=useContext(ThemeContext);if(!ctx)throw new Error('useTheme must be used within ThemeProvider');return ctx}
