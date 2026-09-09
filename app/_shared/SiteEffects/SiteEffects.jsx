"use client";
import {useEffect} from 'react';
import './SiteEffects.css';
export default function SiteEffects(){
 useEffect(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els=[...document.querySelectorAll('.reveal')];
  if(reduce){els.forEach(el=>el.classList.add('is-visible'));return}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -35px'});
  els.forEach(el=>io.observe(el));
  const tiltEls=[...document.querySelectorAll('[data-tilt]')];
  const move=e=>{const el=e.currentTarget,r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*4}deg) translateY(-3px)`};
  const leave=e=>{e.currentTarget.style.transform=''};
  tiltEls.forEach(el=>{el.addEventListener('mousemove',move,{passive:true});el.addEventListener('mouseleave',leave)});
  return()=>{io.disconnect();tiltEls.forEach(el=>{el.removeEventListener('mousemove',move);el.removeEventListener('mouseleave',leave)})}
 },[]);return null;
}
