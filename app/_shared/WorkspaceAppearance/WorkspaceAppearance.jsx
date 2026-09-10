"use client";
import {useEffect} from 'react';
import {useLmsStore} from '@/app/state/LmsStore';

export default function WorkspaceAppearance(){
  const{state}=useLmsStore();
  const settings=state.settings||{};
  useEffect(()=>{
    const root=document.documentElement;
    root.dataset.glass=settings.glassEffects===false?'off':'on';
    root.dataset.gradient=settings.gradientText===false?'off':'on';
    root.dataset.density=settings.workspaceDensity==='compact'?'compact':'comfortable';
  },[settings.glassEffects,settings.gradientText,settings.workspaceDensity]);
  return null;
}
