"use client";
import {LmsStoreProvider} from './state/LmsStore';
import {ThemeProvider} from './state/ThemeContext';
import {ToastProvider} from './_shared/Toast/Toast';
import MediaGuard from './_shared/MediaGuard/MediaGuard';
import WorkspaceAppearance from './_shared/WorkspaceAppearance/WorkspaceAppearance';
import './_shared/BrandLogo/LegacyLogoThemes.css';
import './_shared/WorkspaceAppearance/WorkspaceAppearance.css';
export default function Providers({children}){return <ThemeProvider><LmsStoreProvider><WorkspaceAppearance/><MediaGuard/><ToastProvider>{children}</ToastProvider></LmsStoreProvider></ThemeProvider>}
