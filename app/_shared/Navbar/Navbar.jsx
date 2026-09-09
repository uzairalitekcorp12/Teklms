"use client";
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {Menu,X,ArrowUpRight} from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import BrandLogo from '../BrandLogo/BrandLogo';
import './Navbar.css';
export default function Navbar(){
  const[open,setOpen]=useState(false);const[solid,setSolid]=useState(false);
  useEffect(()=>{const f=()=>setSolid(scrollY>18);f();addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);
  return <header className={`site-nav ${solid?'solid':''}`}><div className="container nav-inner"><Link href="/" className="brand" aria-label="TekLMS home"><BrandLogo priority/></Link><nav className={open?'nav-links open':'nav-links'}><a href="#platform" onClick={()=>setOpen(false)}>Platform</a><a href="#modules" onClick={()=>setOpen(false)}>Modules</a><a href="#experience" onClick={()=>setOpen(false)}>Experience</a><a href="#security" onClick={()=>setOpen(false)}>Secure Learning</a><a href="#contact" onClick={()=>setOpen(false)}>Contact</a><Link href="/login" onClick={()=>setOpen(false)}>Sign in</Link><Link href="/signup" className="nav-signup" onClick={()=>setOpen(false)}>Create account</Link><ThemeToggle compact className="nav-theme"/><Link href="/portal" className="nav-cta" onClick={()=>setOpen(false)}>Open portal <ArrowUpRight size={16}/></Link></nav><div className="nav-mobile-actions"><ThemeToggle compact/><button className="menu-btn" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button></div></div></header>
}
