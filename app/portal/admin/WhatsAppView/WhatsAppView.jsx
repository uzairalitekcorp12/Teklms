"use client";
import {useCallback,useEffect,useMemo,useState} from 'react';
import {AlertCircle,Check,CheckCheck,ExternalLink,FileText,History,Mail,MessageCircleMore,Search,Send,Trash2,Users} from 'lucide-react';
import PageHeading from '../../_components/PageHeading/PageHeading';
import DataTable from '../../_components/DataTable/DataTable';
import {courses} from '@/app/data/seedData';
import {useLmsStore} from '@/app/state/LmsStore';
import {useToast} from '@/app/_shared/Toast/Toast';
import './WhatsAppView.css';
import './CommunicationsV6.css';

const templates={
  'Fee Reminder':{subject:'TekLMS fee reminder',body:'Dear Student,\n\nA fee balance is currently pending. Please review your account details in TekLMS and complete payment by the due date.\n\nRegards,\nAccounts Office'},
  'Attendance Update':{subject:'Your TekLMS attendance update',body:'Dear Student,\n\nYour latest attendance information has been updated in TekLMS. Please sign in to review the current attendance record.\n\nRegards,\nAcademic Office'},
  'Class Update':{subject:'Important class update',body:'Dear Student,\n\nThe upcoming class schedule has been updated. Review the Schedule section in TekLMS for the latest timing and room information.\n\nRegards,\nAcademic Office'},
  'Exam Notice':{subject:'TekLMS examination notice',body:'Dear Student,\n\nThe examination schedule has been published. Please review Exams & Results for subject dates, reporting times and venues.\n\nRegards,\nExamination Office'}
};
const normalizePhone=value=>String(value||'').replace(/\D/g,'');
const displayEmail=student=>student.id==='ST-0010'?'teklms@student':student.email;

export default function WhatsAppView(){
  const{state,addMessage,deleteMessage}=useLmsStore();
  const{toast}=useToast();
  const[firstCourse]=courses;
  const[tab,setTab]=useState('Compose');
  const[channel,setChannel]=useState('WhatsApp');
  const[audienceMode,setAudienceMode]=useState('all');
  const[courseCode,setCourseCode]=useState(firstCourse.code);
  const[className,setClassName]=useState('Grade 10');
  const[section,setSection]=useState('All');
  const[template,setTemplate]=useState('Fee Reminder');
  const[subject,setSubject]=useState(templates['Fee Reminder'].subject);
  const[message,setMessage]=useState(templates['Fee Reminder'].body);
  const[selectedIds,setSelectedIds]=useState([]);
  const[studentSearch,setStudentSearch]=useState('');
  const[historySearch,setHistorySearch]=useState('');
  const[sending,setSending]=useState(false);
  const publicSender=process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'923102218298';
  const[providerStatus,setProviderStatus]=useState(null);
  useEffect(()=>{let active=true;fetch('/api/communications/status').then(response=>response.ok?response.json():null).then(result=>{if(active)setProviderStatus(result)}).catch(()=>{});return()=>{active=false}},[]);
  const provider=providerStatus?.[channel==='Email'?'email':'whatsapp'];

  const classOptions=useMemo(()=>[...new Set(state.students.map(student=>student.className))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})),[state.students]);
  const matchesAudience=useCallback(student=>{
    const courseMatch=(student.courseCodes||[]).includes(courseCode);
    const classMatch=student.className===className&&(section==='All'||student.section===section);
    if(audienceMode==='course')return courseMatch;
    if(audienceMode==='class')return classMatch;
    if(audienceMode==='course-class')return courseMatch&&classMatch;
    return true;
  },[audienceMode,className,courseCode,section]);
  const eligible=useMemo(()=>state.students.filter(student=>matchesAudience(student)&&(channel==='WhatsApp'?normalizePhone(student.phone).length>=8:Boolean(student.email))),[state.students,matchesAudience,channel]);
  const visible=useMemo(()=>eligible.filter(student=>`${student.name} ${student.id} ${student.email} ${student.phone}`.toLowerCase().includes(studentSearch.toLowerCase())),[eligible,studentSearch]);
  const selectedStudents=useMemo(()=>eligible.filter(student=>selectedIds.includes(student.id)),[eligible,selectedIds]);
  const allSelected=eligible.length>0&&eligible.every(student=>selectedIds.includes(student.id));
  useEffect(()=>{setSelectedIds(eligible.map(student=>student.id));setStudentSearch('')},[eligible]);

  const audienceLabel=useMemo(()=>{
    const course=courses.find(item=>item.code===courseCode)?.title||courseCode;
    if(audienceMode==='course')return `${course} students`;
    if(audienceMode==='class')return `${className}${section==='All'?'':` · Section ${section}`}`;
    if(audienceMode==='course-class')return `${course} · ${className}${section==='All'?'':` · ${section}`}`;
    return 'All registered students';
  },[audienceMode,className,courseCode,section]);

  const history=useMemo(()=>state.messages.filter(item=>`${item.channel||'WhatsApp'} ${item.recipient} ${item.message}`.toLowerCase().includes(historySearch.toLowerCase())),[state.messages,historySearch]);
  const toggle=id=>setSelectedIds(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);
  const toggleAll=()=>setSelectedIds(allSelected?[]:eligible.map(student=>student.id));
  const useTemplate=name=>{setTemplate(name);setSubject(templates[name].subject);setMessage(templates[name].body);setTab('Compose')};

  const send=async()=>{
    if(!message.trim())return toast('Write a message before sending.','info');
    if(channel==='Email'&&!subject.trim())return toast('Add an email subject.','info');
    if(!selectedStudents.length)return toast('Select at least one reachable student.','info');
    setSending(true);
    try{
      const response=await fetch(`/api/communications/${channel==='Email'?'email':'whatsapp'}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject,message,recipients:selectedStudents.map(({id,name,email,phone})=>({id,name,email,phone}))})});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.message||'The provider did not accept the message.');
      addMessage({channel,recipient:audienceLabel,recipientCount:selectedStudents.length,recipientIds:selectedStudents.map(student=>student.id),message,subject:channel==='Email'?subject:'',status:result.status,sentAt:new Date().toLocaleString(),providerSent:result.sent,providerFailed:result.failed});
      toast(`${result.sent} accepted by provider; ${result.failed} failed.${result.testMode?' Email was redirected to the configured central inbox.':''}`,result.failed?'info':'success');
      setTab('History');
    }catch(error){toast(error.message||'Unable to send the message.','error')}
    finally{setSending(false)}
  };

  const removeHistory=item=>{if(!confirm('Delete this communication history record? Messages already accepted by the provider cannot be recalled.'))return;deleteMessage(item.id);toast('Communication history record deleted.','success')};
  const reachablePhones=state.students.filter(student=>normalizePhone(student.phone).length>=8).length;
  const reachableEmails=state.students.filter(student=>student.email).length;

  return <>
    <PageHeading eyebrow="Targeted communication" title="Messages" copy="Select students by course, class, section or both, then send through WhatsApp or Resend email." action={null} hideExport secondary={<span className="sender-number"><MessageCircleMore/> Sender +{publicSender}</span>}/>
    <div className="wa-metrics"><div><span><MessageCircleMore/></span><div><b>{reachablePhones}</b><small>WhatsApp contacts</small></div></div><div><span><Mail/></span><div><b>{reachableEmails}</b><small>Email contacts</small></div></div><div><span><Users/></span><div><b>{state.students.length}</b><small>Registered students</small></div></div><div><span><History/></span><div><b>{state.messages.length}</b><small>History records</small></div></div></div>
    <div className="tabs">{['Compose','Templates','History'].map(name=><button type="button" className={tab===name?'active':''} onClick={()=>setTab(name)} key={name}>{name}</button>)}</div>

    {tab==='Compose'&&<div className="communications-layout">
      <section className="portal-card communication-composer">
        <div className="communication-channel-switch"><button type="button" className={channel==='WhatsApp'?'active':''} onClick={()=>setChannel('WhatsApp')}><MessageCircleMore/> WhatsApp</button><button type="button" className={channel==='Email'?'active':''} onClick={()=>setChannel('Email')}><Mail/> Email</button></div>
        <div className={`delivery-note ${provider?.configured?'ready':''}`}><span>{channel==='WhatsApp'?<MessageCircleMore/>:<Mail/>}</span><div><b>{channel}: {provider?.configured?'Configured':'Setup required'}</b><p>{provider?.configured?(channel==='Email'?`From ${provider.from} · ${provider.mode}`:'Delivery uses the connected WhatsApp Business account.'):'Connect the messaging account before sending.'}</p></div></div>

        <div className="audience-builder">
          <div className="audience-mode"><span>Organize recipients by</span><div>{[['all','All'],['course','Course'],['class','Class'],['course-class','Course + class']].map(([value,label])=><button type="button" className={audienceMode===value?'active':''} onClick={()=>setAudienceMode(value)} key={value}>{label}</button>)}</div></div>
          <div className="audience-fields">
            {(audienceMode==='course'||audienceMode==='course-class')&&<label className="field"><span>Course</span><select value={courseCode} onChange={event=>setCourseCode(event.target.value)}>{courses.map(course=><option value={course.code} key={course.code}>{course.title} · {course.code}</option>)}</select></label>}
            {(audienceMode==='class'||audienceMode==='course-class')&&<><label className="field"><span>Class</span><select value={className} onChange={event=>setClassName(event.target.value)}>{classOptions.map(value=><option key={value}>{value}</option>)}</select></label><label className="field"><span>Section</span><select value={section} onChange={event=>setSection(event.target.value)}><option>All</option><option>A</option><option>B</option><option>C</option></select></label></>}
          </div>
        </div>

        <div className="communication-fields form-grid"><label className="field"><span>Template</span><select value={template} onChange={event=>useTemplate(event.target.value)}>{Object.keys(templates).map(name=><option key={name}>{name}</option>)}</select></label>{channel==='Email'&&<label className="field"><span>Email subject</span><input value={subject} onChange={event=>setSubject(event.target.value)} maxLength={180}/></label>}<label className="field full"><span>Message</span><textarea className="wa-textarea" value={message} onChange={event=>setMessage(event.target.value)} maxLength={channel==='WhatsApp'?3800:6000}/><small className="char-count">{message.length}/{channel==='WhatsApp'?3800:6000} characters</small></label></div>

        <section className="communication-recipients"><header><div><b>Exact recipients</b><small>{selectedIds.length} of {eligible.length} reachable students selected · {audienceLabel}</small></div><button type="button" onClick={toggleAll}>{allSelected?<CheckCheck/>:<Check/>} {allSelected?'Clear all':'Select all'}</button></header><label className="recipient-search-v6"><Search/><input value={studentSearch} onChange={event=>setStudentSearch(event.target.value)} placeholder="Search selected audience…"/></label><div className="recipient-list-v6">{visible.map(student=>{const checked=selectedIds.includes(student.id);const manual=`https://wa.me/${normalizePhone(student.phone)}?text=${encodeURIComponent(message)}`;return <article className={checked?'selected':''} key={student.id}><button type="button" className={`check-square ${checked?'checked':''}`} onClick={()=>toggle(student.id)}>{checked&&<Check/>}</button><span className="recipient-avatar">{student.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span><div><b>{student.name}</b><small>{student.className} · {student.section} · {channel==='WhatsApp'?student.phone:displayEmail(student)}</small></div>{channel==='WhatsApp'&&<a href={manual} target="_blank" rel="noreferrer" title={`Open WhatsApp for ${student.name}`}><ExternalLink/></a>}</article>})}{!visible.length&&<div className="recipient-empty">No students with a valid {channel==='WhatsApp'?'phone number':'email'} match this audience.</div>}</div></section>
        <button type="button" className="wa-send communication-send" onClick={send} disabled={sending||!selectedStudents.length}><Send/> {sending?'Sending…':`Send ${channel} to ${selectedStudents.length} student${selectedStudents.length===1?'':'s'}`}</button>
      </section>

      <aside className="communication-preview"><div className="preview-orb"/><span>{channel==='WhatsApp'?<MessageCircleMore/>:<Mail/>}</span><small>{channel==='WhatsApp'?`FROM +${publicSender}`:'RESEND EMAIL PREVIEW'}</small><h3>{channel==='Email'?subject||'Your email subject':audienceLabel}</h3><p>{message||'Your message preview will appear here.'}</p><footer><Users/> {selectedStudents.length} selected recipients</footer></aside>
    </div>}

    {tab==='Templates'&&<div className="template-grid">{Object.entries(templates).map(([name,value],index)=><button type="button" className="portal-card template-card" key={name} onClick={()=>useTemplate(name)}><span className={`template-icon t-${index}`}><FileText/></span><h3>{name}</h3><p>{value.body.replaceAll('\n',' ').slice(0,145)}…</p><b>Use template →</b></button>)}</div>}

    {tab==='History'&&<section className="portal-card history-card"><div className="toolbar"><div className="toolbar-left"><label className="search-field"><Search/><input placeholder="Search channel, audience or message" value={historySearch} onChange={event=>setHistorySearch(event.target.value)}/></label></div></div><DataTable rows={history} pageSize={10} onDelete={removeHistory} columns={[{key:'channel',label:'Channel',render:value=><span className="channel-pill">{value||'WhatsApp'}</span>},{key:'recipient',label:'Audience'},{key:'recipientCount',label:'Students',render:value=>value||'—'},{key:'message',label:'Message',render:value=><span className="message-cell">{value.replaceAll('\n',' ')}</span>},{key:'sentAt',label:'Sent At'},{key:'status',label:'Status',render:value=><span className={`status-pill ${String(value).toLowerCase().replaceAll(' ','-')}`}>{value}</span>}]}/></section>}
  </>;
}
