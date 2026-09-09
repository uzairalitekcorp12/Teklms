"use client";
import {useEffect,useState} from 'react';
import {ShieldCheck} from 'lucide-react';
import {useLmsStore} from '@/app/state/LmsStore';
import './MediaGuard.css';

export default function MediaGuard(){
 const{state}=useLmsStore();
 const[veil,setVeil]=useState(false);
 const settings=state.settings||{};
 useEffect(()=>{
   const protectedTarget=target=>Boolean(target?.closest?.('video,.secure-player,[data-protected-media]'));
   const protectedPlayerOpen=()=>Boolean(document.querySelector('.secure-player'));
   const context=event=>{if(settings.mediaContextProtection!==false&&protectedTarget(event.target))event.preventDefault()};
   const drag=event=>{if(settings.mediaDragProtection!==false&&protectedTarget(event.target))event.preventDefault()};
   const key=event=>{if(settings.shortcutProtection===false||!protectedPlayerOpen())return;const keyName=String(event.key||'').toLowerCase();const blocked=event.key==='F12'||((event.ctrlKey||event.metaKey)&&(keyName==='s'||keyName==='u'))||(event.ctrlKey&&event.shiftKey&&['i','j','c'].includes(keyName));if(blocked){event.preventDefault();event.stopPropagation()}if(event.key==='PrintScreen'&&settings.capturePrivacyVeil!==false){setVeil(true);setTimeout(()=>setVeil(false),1000)}};
   const beforePrint=()=>{if(settings.printProtection!==false&&protectedPlayerOpen()&&!document.body.classList.contains('printing-receipt'))setVeil(true)};
   const afterPrint=()=>setVeil(false);
   document.addEventListener('contextmenu',context,true);
   document.addEventListener('dragstart',drag,true);
   window.addEventListener('keydown',key,true);
   window.addEventListener('beforeprint',beforePrint);
   window.addEventListener('afterprint',afterPrint);
   return()=>{document.removeEventListener('contextmenu',context,true);document.removeEventListener('dragstart',drag,true);window.removeEventListener('keydown',key,true);window.removeEventListener('beforeprint',beforePrint);window.removeEventListener('afterprint',afterPrint)};
 },[settings.mediaContextProtection,settings.mediaDragProtection,settings.shortcutProtection,settings.capturePrivacyVeil,settings.printProtection]);
 return <div className={`global-media-privacy ${veil?'show':''}`} aria-hidden={!veil}><div><ShieldCheck/><b>Protected lecture hidden</b><span>Return to TekLMS to continue secure playback.</span></div></div>
}
