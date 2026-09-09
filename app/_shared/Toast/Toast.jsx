"use client";
import {createContext,useContext,useMemo,useState} from 'react';
import {CheckCircle2,Info,X} from 'lucide-react';
import './Toast.css';
const ToastContext=createContext(null);
export function ToastProvider({children}){
  const[toasts,setToasts]=useState([]);
  const toast=(message,type='success')=>{const id=Date.now()+Math.random();setToasts(v=>[...v,{id,message,type}]);setTimeout(()=>setToasts(v=>v.filter(t=>t.id!==id)),3200)};
  const api=useMemo(()=>({toast}),[]);
  return <ToastContext.Provider value={api}>{children}<div className="toast-stack" aria-live="polite">{toasts.map(t=><div className={`toast toast-${t.type}`} key={t.id}>{t.type==='success'?<CheckCircle2/>:<Info/>}<span>{t.message}</span><button onClick={()=>setToasts(v=>v.filter(x=>x.id!==t.id))} aria-label="Dismiss"><X/></button></div>)}</div></ToastContext.Provider>
}
export const useToast=()=>{const v=useContext(ToastContext);if(!v)throw new Error('useToast must be used inside ToastProvider');return v};
