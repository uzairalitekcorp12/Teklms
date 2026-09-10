"use client";
import {useMemo,useState} from 'react';
import {BookOpen,CalendarClock,CheckCircle2,Clock3,Link2,LockKeyhole,PlayCircle,Search,ShieldCheck,Trash2,Users,Video} from 'lucide-react';
import PageHeading from '../../_components/PageHeading/PageHeading';
import StatCard from '../../_components/StatCard/StatCard';
import Modal from '@/app/_shared/Modal/Modal';
import SecureVideoPlayer from '@/app/_shared/SecureVideoPlayer/SecureVideoPlayer';
import {courses} from '@/app/data/seedData';
import {useLmsStore} from '@/app/state/LmsStore';
import {useToast} from '@/app/_shared/Toast/Toast';
import './LecturesView.css';
import './LecturesV6.css';

const firstCourse=courses[0];
const blank={title:'',course:firstCourse.title,courseCode:firstCourse.code,teacher:firstCourse.teacher,duration:'20 min',status:'Published',audience:'All Students',audienceScope:'all',description:'',videoUrl:'',watermark:true,focusGuard:true};

export default function LecturesView(){
  const{state,addLecture,updateLecture,deleteLecture}=useLmsStore();
  const{toast}=useToast();
  const[q,setQ]=useState('');
  const[filter,setFilter]=useState('All');
  const[selected,setSelected]=useState(null);
  const[creating,setCreating]=useState(false);
  const[form,setForm]=useState(blank);
  const rows=useMemo(()=>state.lectures.filter(lecture=>(filter==='All'||lecture.status===filter)&&`${lecture.title} ${lecture.course} ${lecture.teacher}`.toLowerCase().includes(q.toLowerCase())),[state.lectures,filter,q]);
  const published=state.lectures.filter(lecture=>lecture.status==='Published').length;
  const scheduled=state.lectures.filter(lecture=>lecture.status==='Scheduled').length;
  const linked=state.lectures.filter(lecture=>lecture.videoUrl).length;

  const create=event=>{
    event.preventDefault();
    try{const url=new URL(form.videoUrl);if(url.protocol!=='https:')throw new Error()}catch{return toast('Enter a valid HTTPS Amazon S3 or CloudFront video URL.','info')}
    addLecture({...form,audience:form.audienceScope==='all'?'All Students':form.course,lesson:state.lectures.length+1,published:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),poster:'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1200'});
    setCreating(false);
    setForm(blank);
    toast('Amazon-linked lecture published to the selected audience.','success');
  };
  const toggleStatus=(lecture,event)=>{event?.stopPropagation();const next=lecture.status==='Published'?'Scheduled':'Published';updateLecture(lecture.id,{status:next});setSelected(current=>current?.id===lecture.id?{...current,status:next}:current);toast(`Lecture ${next.toLowerCase()}.`,'success')};
  const remove=lecture=>{if(!confirm(`Delete “${lecture.title}”? It will disappear from every student lecture library.`))return;deleteLecture(lecture.id);setSelected(null);toast('Lecture deleted from admin and student portals.','success')};

  return <div className="lectures-admin">
    <PageHeading eyebrow="Learning content" title="Lectures" copy="Link Amazon S3 or CloudFront videos, choose the audience and protect playback from one library." action="Add Lecture" onAction={()=>setCreating(true)} hideExport secondary={<div className="lecture-security-chip"><ShieldCheck/> Protected media</div>}/>
    <div className="lecture-stats"><StatCard icon={Video} label="Lecture library" value={state.lectures.length} meta="Across active subjects" tone="green"/><StatCard icon={CheckCircle2} label="Published" value={published} meta="Available to students" tone="blue"/><StatCard icon={CalendarClock} label="Scheduled" value={scheduled} meta="Queued for release" tone="orange"/><StatCard icon={Link2} label="Amazon links" value={linked} meta="S3 or CloudFront streams" tone="violet"/></div>
    <section className="lecture-library-panel"><div className="lecture-toolbar"><div className="lecture-search"><Search/><input value={q} onChange={event=>setQ(event.target.value)} placeholder="Search lectures, courses or instructors…"/></div><div className="lecture-filters">{['All','Published','Scheduled'].map(value=><button type="button" key={value} className={filter===value?'active':''} onClick={()=>setFilter(value)}>{value}</button>)}</div></div>
      <div className="admin-lecture-grid">{rows.map(lecture=><article className="admin-lecture-card" key={lecture.id} onClick={()=>setSelected(lecture)}><div className="lecture-cover"><img src={lecture.poster} alt=""/><span className="lecture-cover-shade"/><span className="lecture-play"><PlayCircle/></span><span className={`lecture-state ${lecture.status.toLowerCase()}`}>{lecture.status}</span><span className="lecture-duration"><Clock3/> {lecture.duration}</span></div><div className="lecture-card-body"><div className="lecture-course-line"><span>{lecture.courseCode}</span><b>Lesson {String(lecture.lesson).padStart(2,'0')}</b></div><h3>{lecture.title}</h3><p>{lecture.description}</p><div className="lecture-meta"><span><BookOpen/> {lecture.course}</span><span><Users/> {lecture.audience}</span></div><footer><div><b>{lecture.teacher}</b><span>{lecture.published}</span></div><button type="button" onClick={event=>toggleStatus(lecture,event)}>{lecture.status==='Published'?'Schedule':'Publish'}</button></footer></div></article>)}</div>
      {!rows.length&&<div className="empty-state"><b>No lectures found</b><p>Add your Amazon video link or try a different filter.</p></div>}
    </section>

    <Modal open={creating} onClose={()=>setCreating(false)} eyebrow="Lecture library" title="Add Amazon-linked lecture" size="lg" footer={<><button type="button" className="btn-secondary" onClick={()=>setCreating(false)}>Cancel</button><button type="submit" className="btn-primary" form="lecture-create">Save Lecture</button></>}>
      <form id="lecture-create" className="form-grid" onSubmit={create}>
        <label className="field full"><span>Lecture title</span><input required value={form.title} onChange={event=>setForm({...form,title:event.target.value})} placeholder="e.g. Course orientation session"/></label>
        <label className="field"><span>Course</span><select value={form.courseCode} onChange={event=>{const selectedCourse=courses.find(course=>course.code===event.target.value)||firstCourse;setForm({...form,course:selectedCourse.title,courseCode:selectedCourse.code,teacher:selectedCourse.teacher})}}>{courses.map(course=><option value={course.code} key={course.code}>{course.title} · {course.code}</option>)}</select></label>
        <label className="field"><span>Instructor</span><input value={form.teacher} onChange={event=>setForm({...form,teacher:event.target.value})}/></label>
        <label className="field"><span>Duration</span><input value={form.duration} onChange={event=>setForm({...form,duration:event.target.value})} placeholder="20 min"/></label>
        <label className="field"><span>Release status</span><select value={form.status} onChange={event=>setForm({...form,status:event.target.value})}><option>Published</option><option>Scheduled</option></select></label>
        <label className="field full"><span>Who can watch</span><select value={form.audienceScope} onChange={event=>setForm({...form,audienceScope:event.target.value})}><option value="all">All registered students</option><option value="course">Only students enrolled in this course</option></select></label>
        <label className="field full"><span>Amazon S3 / CloudFront video URL</span><div className="lecture-link-field"><Link2/><input required type="url" inputMode="url" value={form.videoUrl} onChange={event=>setForm({...form,videoUrl:event.target.value})} placeholder="https://your-distribution.cloudfront.net/lecture.mp4"/></div><small>Use an HTTPS object or signed CloudFront URL with video content type and range requests enabled.</small></label>
        <label className="field full"><span>Description</span><textarea required value={form.description} onChange={event=>setForm({...form,description:event.target.value})} placeholder="What will students learn in this lecture?"/></label>
        <div className="protection-options full"><label><input type="checkbox" checked={form.watermark} onChange={event=>setForm({...form,watermark:event.target.checked})}/><span><ShieldCheck/><b>Dynamic identity watermark</b><small>Displays account identity during playback.</small></span></label><label><input type="checkbox" checked={form.focusGuard} onChange={event=>setForm({...form,focusGuard:event.target.checked})}/><span><LockKeyhole/><b>Focus protection</b><small>Pauses protected playback when the window loses focus.</small></span></label></div>
      </form>
    </Modal>

    <Modal open={Boolean(selected)} onClose={()=>setSelected(null)} eyebrow={selected?.course} title={selected?.title||'Lecture'} size="xl" footer={selected&&<><button type="button" className="btn-danger" onClick={()=>remove(selected)}><Trash2/> Delete</button><button type="button" className="btn-secondary" onClick={()=>setSelected(null)}>Close</button><button type="button" className="btn-primary" onClick={event=>toggleStatus(selected,event)}>{selected.status==='Published'?'Move to Schedule':'Publish Lecture'}</button></>}>
      {selected&&<div className="lecture-preview-layout"><SecureVideoPlayer lecture={selected} identity="Administrator · Content Review"/><div className="lecture-detail-grid"><div><span>Instructor</span><b>{selected.teacher}</b></div><div><span>Audience</span><b>{selected.audience}</b></div><div><span>Duration</span><b>{selected.duration}</b></div><div><span>Delivery</span><b>{selected.videoUrl?'Amazon linked stream':'Encrypted lecture asset'}</b></div></div><p className="lecture-preview-copy">{selected.description}</p></div>}
    </Modal>
  </div>;
}
