"use client";
import {Moon,Sun} from 'lucide-react';
import {useTheme} from '@/app/state/ThemeContext';
import './ThemeToggle.css';
export default function ThemeToggle({compact=false,className=''}){const{theme,toggleTheme}=useTheme();const dark=theme==='dark';return <button type="button" className={`theme-toggle ${compact?'compact':''} ${className}`} onClick={toggleTheme} aria-label={dark?'Switch to light theme':'Switch to dark theme'} title={dark?'Light theme':'Dark theme'}><span className="theme-toggle-icon">{dark?<Sun/>:<Moon/>}</span>{!compact&&<span>{dark?'Light':'Dark'}</span>}</button>}
