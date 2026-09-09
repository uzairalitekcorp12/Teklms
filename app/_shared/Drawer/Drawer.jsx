"use client";
import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import './Drawer.css';
export default function Drawer({open,onClose,title,eyebrow,children,width='520px'}){
 const[mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);
 useEffect(()=>{if(!open)return;const fn=e=>e.key==='Escape'&&onClose?.();document.addEventListener('keydown',fn);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',fn);document.body.style.overflow=old}},[open,onClose]);
 if(!open||!mounted)return null;
 return createPortal(<div className="drawer-layer" onMouseDown={e=>e.target===e.currentTarget&&onClose?.()}><aside className="drawer-panel" style={{'--drawer-width':width}}><header><div>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div><button onClick={onClose} aria-label="Close"><X/></button></header><div className="drawer-body">{children}</div></aside></div>,document.body)
}
