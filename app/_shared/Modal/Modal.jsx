"use client";
import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import './Modal.css';
export default function Modal({open,onClose,title,eyebrow,children,size='md',footer}){
  const[mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);
  useEffect(()=>{if(!open)return;const fn=e=>e.key==='Escape'&&onClose?.();document.addEventListener('keydown',fn);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',fn);document.body.style.overflow=old}},[open,onClose]);
  if(!open||!mounted)return null;
  return createPortal(<div className="modal-layer" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onClose?.()}><section className={`modal-box modal-${size}`} role="dialog" aria-modal="true" aria-label={title}><header><div>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div><button onClick={onClose} aria-label="Close"><X/></button></header><div className="modal-body">{children}</div>{footer&&<footer>{footer}</footer>}</section></div>,document.body)
}
