"use client";
import {BarChart3,Bell,BookOpen,CalendarDays,ChevronRight,ClipboardCheck,GraduationCap,Landmark,LayoutDashboard,LifeBuoy,MessageCircleMore,Radio,ReceiptText,Settings,ShieldCheck,Trophy,UserCheck,UserPlus,UserRound,Users,Video,WalletCards,X} from 'lucide-react';
import BrandLogo from '@/app/_shared/BrandLogo/BrandLogo';
import './Sidebar.css';

const icons={dashboard:LayoutDashboard,academic:GraduationCap,students:Users,administration:Landmark,accounts:WalletCards,whatsapp:MessageCircleMore,reports:BarChart3,settings:Settings,overview:LayoutDashboard,courses:BookOpen,lectures:Video,liveSessions:Radio,registrations:UserPlus,security:ShieldCheck,schedule:CalendarDays,assignments:ClipboardCheck,results:Trophy,attendance:UserCheck,fees:ReceiptText,announcements:Bell,profile:UserRound};

export default function Sidebar({items,active,onChange,open,onClose}){
  return <>
    <div className={`sidebar-overlay ${open?'show':''}`} onClick={onClose}/>
    <aside className={`portal-sidebar ${open?'mobile-open':''}`}>
      <div className="portal-logo"><BrandLogo darkSurface priority/><button type="button" onClick={onClose} aria-label="Close navigation"><X/></button></div>
      <div className="portal-menu-label">Workspace</div>
      <nav>{items.map(item=>{const Icon=icons[item.key]||LayoutDashboard;return <button type="button" key={item.key} className={active===item.key?'active':''} onClick={()=>{onChange(item.key);onClose?.()}}><span className="nav-icon"><Icon/></span><span>{item.label}</span><ChevronRight className="nav-chevron"/></button>})}</nav>
      <div className="sidebar-bottom"><div className="support-card"><span className="support-icon"><LifeBuoy/></span><div><b>Help & Support</b><span>Questions about your workspace?</span><a href="mailto:support@teklms.com">Contact support</a></div></div><small>TekLMS · Academic Workspace</small></div>
    </aside>
  </>;
}
