"use client";
import {useMemo} from 'react';
import {BellRing,CalendarClock,ExternalLink,Mail,Play,Radio,Video} from 'lucide-react';
import {useLmsStore} from '@/app/state/LmsStore';
import {useToast} from '@/app/_shared/Toast/Toast';
import './LiveSessionsView.css';

export default function LiveSessionsView(){
  const{state}=useLmsStore();const{toast}=useToast();
  const assigned=state.profile?.courseCodes||[];
  const sessions=useMemo(()=>(state.liveSessions||[]).filter(item=>assigned.includes(item.courseCode)&&(item.recipientIds||[]).includes(state.profile.id)),[state.liveSessions,state.profile.id,assigned]);
  const join=item=>{window.open(item.url,'_blank','noopener,noreferrer');toast('Opening your live class.','success')};
  return <div className="student-live-view">
    <div className="student-page-heading"><div><span>Live learning</span><h1>Live Classes</h1><p>Join live sessions shared with your course directly from your student portal.</p></div><div className="student-live-count"><Radio/><span>{sessions.length} session{sessions.length===1?'':'s'}</span></div></div>
    <section className="student-live-hero"><div><span className="student-live-kicker"><i/> LIVE CLASS CENTER</span><h2>Your class links, in one reliable place.</h2><p>Whenever your instructor shares a live session, it appears here and in your notification panel. The same invitation is also sent to your registered email address.</p><div className="student-live-channels"><span><BellRing/> Portal alerts</span><span><Mail/> Email delivery</span></div></div><span className="student-live-hero-icon"><Video/></span></section>
    {sessions.length?<div className="student-live-grid">{sessions.map((item,index)=><article className="student-live-card" key={item.id}><div className="student-live-cover"><span className="live-course-code">{item.courseCode}</span><span className="live-signal"><i/> LIVE LINK</span><div className="student-live-play"><Play/></div><div className="live-ring ring-a"/><div className="live-ring ring-b"/></div><div className="student-live-body"><span className="student-live-course">{item.courseTitle}</span><h3>{item.title}</h3><p>{item.message}</p><div className="student-live-meta"><span><CalendarClock/> {new Date(item.sentAt).toLocaleString()}</span><span><Mail/> Sent to your email</span></div><button onClick={()=>join(item)}>Join Live Class <ExternalLink/></button></div></article>)}</div>:<section className="student-live-empty"><span><Radio/></span><h2>No live class links right now</h2><p>When an instructor shares a session with one of your courses, it will appear here automatically.</p></section>}
  </div>
}
