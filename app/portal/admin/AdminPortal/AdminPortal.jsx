"use client";
import {useState} from 'react';
import PortalShell from '../../_components/PortalShell/PortalShell';
import {adminModules} from '@/app/data/seedData';
import DashboardView from '../DashboardView/DashboardView';
import AcademicView from '../AcademicView/AcademicView';
import StudentsView from '../StudentsView/StudentsView';
import LecturesView from '../LecturesView/LecturesView';
import AdministrationView from '../AdministrationView/AdministrationView';
import AccountsView from '../AccountsView/AccountsView';
import WhatsAppView from '../WhatsAppView/WhatsAppView';
import ReportsView from '../ReportsView/ReportsView';
import SettingsView from '../SettingsView/SettingsView';
import LiveSessionsView from '../LiveSessionsView/LiveSessionsView';
import RegistrationsView from '../RegistrationsView/RegistrationsView';
import './AdminPortal.css';
export default function AdminPortal(){const[active,setActive]=useState('dashboard');const views={dashboard:<DashboardView onNavigate={setActive}/>,academic:<AcademicView/>,lectures:<LecturesView/>,liveSessions:<LiveSessionsView/>,registrations:<RegistrationsView/>,students:<StudentsView/>,administration:<AdministrationView/>,accounts:<AccountsView/>,whatsapp:<WhatsAppView/>,reports:<ReportsView/>,settings:<SettingsView/>};return <PortalShell role="admin" items={adminModules} active={active} onChange={setActive}><div className="admin-view">{views[active]}</div></PortalShell>}
