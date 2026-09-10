"use client";
import {useEffect,useMemo,useState} from 'react';
import {BellRing,Check,CheckCheck,ExternalLink,Mail,Radio,Search,Send,Users,Video,Clock3,Link2,ChevronDown,Trash2} from 'lucide-react';
import PageHeading from '../../_components/PageHeading/PageHeading';
import StatCard from '../../_components/StatCard/StatCard';
import {courses} from '@/app/data/seedData';
import {useLmsStore} from '@/app/state/LmsStore';
import {useToast} from '@/app/_shared/Toast/Toast';
import './LiveSessionsView.css';
import './LiveSessionsResponsive.css';

const isYouTubeUrl=value=>{
  try{const url=new URL(value);return ['youtube.com','www.youtube.com','m.youtube.com','youtu.be'].includes(url.hostname)}catch{return false}
};

export default function LiveSessionsView(){
  const{state,sendLiveSession,deleteLiveSession}=useLmsStore();
  const{toast}=useToast();
  const[firstCourse]=courses;
  const[form,setForm]=useState({title:'',courseCode:firstCourse.code,url:'',message:'Your live class is ready. Join using the link below.'});
  const[selectedIds,setSelectedIds]=useState([]);
  const[studentSearch,setStudentSearch]=useState('');
  const[classFilter,setClassFilter]=useState('All');
  const[sectionFilter,setSectionFilter]=useState('All');
  const[sending,setSending]=useState(false);
  const[showRecipients,setShowRecipients]=useState(true);
  const course=courses.find(item=>item.code===form.courseCode)||firstCourse;
  const classOptions=useMemo(()=>[...new Set(state.students.map(student=>student.className))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})),[state.students]);
  const eligible=useMemo(()=>state.students.filter(student=>(student.courseCodes||[]).includes(form.courseCode)&&(classFilter==='All'||student.className===classFilter)&&(sectionFilter==='All'||student.section===sectionFilter)),[state.students,form.courseCode,classFilter,sectionFilter]);
  const visible=useMemo(()=>eligible.filter(student=>`${student.name} ${student.id} ${student.email}`.toLowerCase().includes(studentSearch.toLowerCase())),[eligible,studentSearch]);

  useEffect(()=>{setSelectedIds(eligible.map(s=>s.id));setStudentSearch('')},[eligible]);

  const allSelected=eligible.length>0&&eligible.every(s=>selectedIds.includes(s.id));
  const toggle=id=>setSelectedIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const toggleAll=()=>setSelectedIds(allSelected?[]:eligible.map(s=>s.id));
  const selectedStudents=eligible.filter(s=>selectedIds.includes(s.id));

  const submit=async e=>{
    e.preventDefault();
    if(!form.title.trim())return toast('Add a session title before sending.','info');
    if(!isYouTubeUrl(form.url))return toast('Enter a valid YouTube live link.','info');
    if(!selectedStudents.length)return toast('Select at least one student.','info');
    setSending(true);
    let emailResult={emailConfigured:false,sent:0,failed:selectedStudents.length,status:'pending'};
    try{
      const response=await fetch('/api/live-links/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:form.title.trim(),courseTitle:course.title,courseCode:course.code,url:form.url.trim(),message:form.message.trim(),recipients:selectedStudents.map(s=>({id:s.id,name:s.name,email:s.email}))})});
      const data=await response.json();
      if(response.ok)emailResult=data;
      else toast(data?.message||'Email delivery could not be completed. Portal notifications will still be sent.','info');
    }catch{toast('Email delivery is currently unavailable. Portal notifications will still be sent.','info')}
    sendLiveSession({title:form.title.trim(),courseTitle:course.title,courseCode:course.code,className:classFilter,section:sectionFilter,url:form.url.trim(),message:form.message.trim(),recipientIds:selectedStudents.map(s=>s.id),recipientCount:selectedStudents.length,emailStatus:emailResult.emailConfigured?(emailResult.failed?'Partially sent':'Sent'):'Pending mail setup',emailSent:emailResult.sent||0,emailFailed:emailResult.failed||0});
    setForm(prev=>({...prev,title:'',url:''}));
    toast(`Live class sent to ${selectedStudents.length} student${selectedStudents.length===1?'':'s'}.`,'success');
    setSending(false);
  };

  const removeSession=item=>{
    if(!confirm(`Delete “${item.title}”? This removes the live class and its notifications from every selected student portal. Already-delivered emails cannot be recalled.`))return;
    deleteLiveSession(item.id);
    toast('Live class and student portal notifications deleted.','success');
  };

  const totalDelivered=(state.liveSessions||[]).reduce((sum,item)=>sum+(item.recipientCount||0),0);
  return <div className="live-admin-view">
    <PageHeading eyebrow="Class communication" title="Live Sessions" copy="Share YouTube live classes with students selected by course, class and section through email and their portal." hideExport secondary={<span className="live-ready-chip"><Radio/> Live link delivery</span>}/>
    <div className="live-stat-grid">
      <StatCard icon={Video} label="Sessions sent" value={(state.liveSessions||[]).length} meta="Shared from this workspace" tone="green"/>
      <StatCard icon={Users} label="Student deliveries" value={totalDelivered} meta="Email + portal recipients" tone="blue"/>
      <StatCard icon={BellRing} label="Portal alerts" value={totalDelivered} meta="Available in student notifications" tone="violet"/>
      <StatCard icon={Mail} label="Email channel" value={(state.liveSessions||[]).some(x=>x.emailStatus==='Sent')?'Active':'Ready'} meta="Uses configured mail delivery" tone="orange"/>
    </div>

    <div className="live-compose-layout">
      <form className="live-compose-card" onSubmit={submit}>
        <div className="live-card-head"><div><span>New live class</span><h2>Send a live session link</h2><p>Select a course, paste the YouTube live URL and confirm exactly who should receive it.</p></div><span className="live-step-badge">3-step delivery</span></div>
        <div className="live-form-grid">
          <label className="field"><span>Course</span><div className="live-select-wrap"><select value={form.courseCode} onChange={e=>setForm({...form,courseCode:e.target.value})}>{courses.map(c=><option value={c.code} key={c.code}>{c.title} · {c.code}</option>)}</select><ChevronDown/></div></label>
          <label className="field"><span>Session title</span><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Term revision — live class"/></label>
          <label className="field"><span>Class filter</span><div className="live-select-wrap"><select value={classFilter} onChange={e=>{setClassFilter(e.target.value);setSectionFilter('All')}}><option>All</option>{classOptions.map(value=><option key={value}>{value}</option>)}</select><ChevronDown/></div></label>
          <label className="field"><span>Section filter</span><div className="live-select-wrap"><select value={sectionFilter} onChange={e=>setSectionFilter(e.target.value)}><option>All</option><option>A</option><option>B</option><option>C</option></select><ChevronDown/></div></label>
          <label className="field full"><span>YouTube live link</span><div className="live-link-input"><Link2/><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://youtube.com/live/..." inputMode="url"/></div></label>
          <label className="field full"><span>Message for students</span><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label>
        </div>

        <section className="recipient-section">
          <button type="button" className="recipient-title-row" onClick={()=>setShowRecipients(v=>!v)}><div><span className="recipient-icon"><Users/></span><div><b>Recipients</b><small>{selectedIds.length} of {eligible.length} enrolled students selected · {classFilter}{sectionFilter==='All'?'':` / ${sectionFilter}`}</small></div></div><ChevronDown className={showRecipients?'open':''}/></button>
          {showRecipients&&<div className="recipient-body">
            <div className="recipient-toolbar"><div className="recipient-search"><Search/><input value={studentSearch} onChange={e=>setStudentSearch(e.target.value)} placeholder="Search students by name, ID or email…"/></div><button type="button" className="select-all-btn" onClick={toggleAll}>{allSelected?<CheckCheck/>:<Check/>}{allSelected?'Clear all':'Select all'}</button></div>
            <div className="recipient-table-wrap"><table className="recipient-table"><thead><tr><th className="tick-col"><button type="button" className={`check-square ${allSelected?'checked':''}`} onClick={toggleAll}>{allSelected&&<Check/>}</button></th><th>Student</th><th>Class</th><th>Email</th><th>Status</th></tr></thead><tbody>{visible.map(student=>{const checked=selectedIds.includes(student.id);return <tr key={student.id} className={checked?'selected':''} onClick={()=>toggle(student.id)}><td><button type="button" className={`check-square ${checked?'checked':''}`} onClick={e=>{e.stopPropagation();toggle(student.id)}}>{checked&&<Check/>}</button></td><td><div className="student-cell"><span>{student.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><div><b>{student.name}</b><small>{student.id}</small></div></div></td><td>{student.className} · {student.section}</td><td>{student.email}</td><td><span className={`status-pill ${student.status==='Active'?'active':'leave'}`}>{student.status}</span></td></tr>})}</tbody></table>{!visible.length&&<div className="recipient-empty">{eligible.length?'No enrolled students match this search.':`No students are enrolled in ${course.title}. Assign the course from Students first.`}</div>}</div>
          </div>}
        </section>

        <div className="delivery-review"><div className="delivery-channel"><span><Mail/></span><div><b>Email delivery</b><small>{selectedIds.length} personalized recipient{selectedIds.length===1?'':'s'}</small></div></div><div className="delivery-plus">+</div><div className="delivery-channel"><span><BellRing/></span><div><b>Portal notification</b><small>Appears in each selected student account</small></div></div></div>
        <button className="send-live-btn" disabled={sending||!selectedIds.length}><Send/>{sending?'Sending live class…':`Send to ${selectedIds.length} student${selectedIds.length===1?'':'s'}`}</button>
      </form>

      <aside className="live-preview-card"><div className="preview-live-top"><span><i/> LIVE SESSION</span><small>{course.code}</small></div><div className="preview-screen"><div className="preview-screen-center"><span><Radio/></span><b>{form.title||'Your session title'}</b><small>YouTube Live</small></div></div><div className="preview-content"><span className="preview-course">{course.title}</span><h3>{form.title||'Live class invitation'}</h3><p>{form.message||'Students will see your message here.'}</p><div className="preview-recipient-summary"><Users/><span><b>{selectedIds.length}</b> selected students</span></div><div className="preview-destination"><div><Mail/><span>Email inbox</span><Check/></div><div><BellRing/><span>Student portal</span><Check/></div></div></div></aside>
    </div>

    <section className="live-history-card"><div className="live-history-head"><div><span>Delivery history</span><h2>Recently shared live sessions</h2></div><small>{(state.liveSessions||[]).length} records</small></div>{(state.liveSessions||[]).length?<div className="live-history-list">{state.liveSessions.map(item=><article className="live-history-row" key={item.id}><span className="history-icon"><Radio/></span><div className="history-main"><div><span>{item.courseCode}</span><small>{new Date(item.sentAt).toLocaleString()}</small></div><h3>{item.title}</h3><p>{item.courseTitle}</p></div><div className="history-delivery"><span><Users/> {item.recipientCount||item.recipientIds?.length||0}</span><span><BellRing/> Portal sent</span><span className={item.emailStatus==='Sent'?'email-ok':'email-wait'}><Mail/> {item.emailStatus||'Pending'}</span></div><div className="history-actions"><a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`}><ExternalLink/></a><button type="button" onClick={()=>removeSession(item)} aria-label={`Delete ${item.title}`} title="Delete live class"><Trash2/></button></div></article>)}</div>:<div className="empty-state"><b>No live sessions sent yet</b><p>Your sent live links will appear here with recipient and delivery details.</p></div>}</section>
  </div>
}
