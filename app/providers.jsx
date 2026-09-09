"use client";
import {LmsStoreProvider} from './state/LmsStore';
import {ThemeProvider} from './state/ThemeContext';
import {ToastProvider} from './_shared/Toast/Toast';
import MediaGuard from './_shared/MediaGuard/MediaGuard';
import './_shared/BrandLogo/LegacyLogoThemes.css';
export default function Providers({children}){return <ThemeProvider><LmsStoreProvider><MediaGuard/><ToastProvider>{children}</ToastProvider></LmsStoreProvider></ThemeProvider>}
