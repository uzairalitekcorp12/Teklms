"use client";
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import './PortalRouter.css';
export default function PortalRouter(){const router=useRouter();useEffect(()=>{let alive=true;(async()=>{try{const r=await fetch('/api/auth/session',{cache:'no-store'});const a=await r.json();if(!alive)return;router.replace(r.ok&&a?.authenticated?`/portal/${a.role}`:'/login')}catch{if(alive)router.replace('/login')}})();return()=>{alive=false}},[router]);return <div className="portal-loading"><img src="/assets/teklms-mark.svg" alt="TekLMS"/><span>Opening TekLMS…</span></div>}
