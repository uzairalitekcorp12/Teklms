"use client";
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './PortalShell.css';
export default function PortalShell({role,items,active,onChange,children}){
 const router=useRouter();const[ready,setReady]=useState(false);const[mobile,setMobile]=useState(false);
 useEffect(()=>{let alive=true;(async()=>{try{const response=await fetch('/api/auth/session',{cache:'no-store'});const auth=await response.json();if(!response.ok||!auth?.authenticated||auth.role!==role){router.replace('/login');return}if(alive)setReady(true)}catch{router.replace('/login')}})();return()=>{alive=false}},[role,router]);
 if(!ready)return <div className="shell-loading"><div className="loading-mark"><img src="/assets/teklms-mark.svg" alt="TekLMS"/></div><span>Opening your workspace…</span></div>;
 return <div className="portal-shell"><Sidebar role={role} items={items} active={active} onChange={onChange} open={mobile} onClose={()=>setMobile(false)}/><div className="portal-main"><Topbar role={role} items={items} active={active} onNavigate={onChange} onMenu={()=>setMobile(true)}/><main className="portal-content">{children}</main></div></div>
}
