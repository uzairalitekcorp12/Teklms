"use client";
import {useMemo,useState} from 'react';
import {CalendarDays,ClipboardCheck,FileBadge,Search,Clock3,MapPin,GraduationCap,Plus,CheckCircle2,BarChart3,Trash2} from 'lucide-react';
import PageHeading from '../../_components/PageHeading/PageHeading';
import DataTable from '../../_components/DataTable/DataTable';
import Modal from '@/app/_shared/Modal/Modal';
import Drawer from '@/app/_shared/Drawer/Drawer';
import {useLmsStore} from '@/app/state/LmsStore';
import {courses,timetable} from '@/app/data/seedData';
import {useToast} from '@/app/_shared/Toast/Toast';
import {exportCsv} from '@/app/lib/export';
import './AcademicView.css';
import './AcademicActions.css';

const tabs=['Classes','Timetable','Assignments','Exams','Results'];

export default function AcademicView(){
 const{state,addClass,deleteClass}=useLmsStore();
 const{toast}=useToast();
 const[tab,setTab]=useState('Classes');
 const[q,setQ]=useState('');
 const[addOpen,setAddOpen]=useState(false);
 const[selected,setSelected]=useState(null);
 const[form,setForm]=useState({name:'Grade 10',section:'A',subjects:7,students:28,teacher:'Ms. Hira Khan',room:'A-201',schedule:'08:00 AM',status:'Active'});
 const rows=useMemo(()=>state.classes.filter(item=>`${item.name} ${item.section} ${item.teacher}`.toLowerCase().includes(q.toLowerCase())),[state.classes,q]);
 const submit=event=>{event.preventDefault();addClass(form);setAddOpen(false);toast('Class added to the academic workspace.')};
 const removeClass=item=>{if(!confirm(`Delete ${item.name} — Section ${item.section}?`))return;deleteClass(item.id);if(selected?.id===item.id)setSelected(null);toast('Class record deleted.','success')};

 return <><PageHeading eyebrow="Academic operations" title="Academic" copy="Manage classes, timetable, coursework, examinations and results from one structured workspace." action="Add Class" onAction={()=>setAddOpen(true)} onExport={()=>exportCsv('teklms-classes.csv',state.classes)}/><div className="tabs">{tabs.map(item=><button className={tab===item?'active':''} onClick={()=>setTab(item)} key={item}>{item}</button>)}</div>
  {tab==='Classes'&&<section className="portal-card academic-table"><div className="toolbar"><div className="toolbar-left"><label className="search-field"><Search/><input placeholder="Search class or teacher" value={q} onChange={event=>setQ(event.target.value)}/></label></div><div className="toolbar-right"><span className="record-count">{rows.length} classes</span></div></div><DataTable rows={rows} pageSize={10} onView={setSelected} onDelete={removeClass} columns={[{key:'name',label:'Class'},{key:'section',label:'Section'},{key:'subjects',label:'Subjects'},{key:'students',label:'Students'},{key:'teacher',label:'Class Teacher'},{key:'room',label:'Room'},{key:'status',label:'Status',render:value=><span className={`status-pill ${value.toLowerCase()}`}>{value}</span>}]}/></section>}
  {tab==='Timetable'&&<TimetablePanel/>}
  {tab==='Assignments'&&<AssignmentsPanel state={state}/>}
  {tab==='Exams'&&<ExamPanel/>}
  {tab==='Results'&&<ResultsPanel/>}
  <Modal open={addOpen} onClose={()=>setAddOpen(false)} eyebrow="Academic setup" title="Add class" footer={<><button className="btn-secondary" onClick={()=>setAddOpen(false)}>Cancel</button><button className="btn-primary" form="class-form" type="submit"><Plus/> Add Class</button></>}><form id="class-form" onSubmit={submit} className="form-grid"><label className="field"><span>Class name</span><input value={form.name} onChange={event=>setForm({...form,name:event.target.value})} required/></label><label className="field"><span>Section</span><select value={form.section} onChange={event=>setForm({...form,section:event.target.value})}><option>A</option><option>B</option><option>C</option></select></label><label className="field"><span>Class teacher</span><input value={form.teacher} onChange={event=>setForm({...form,teacher:event.target.value})} required/></label><label className="field"><span>Room</span><input value={form.room} onChange={event=>setForm({...form,room:event.target.value})}/></label><label className="field"><span>Students</span><input type="number" min="1" value={form.students} onChange={event=>setForm({...form,students:Number(event.target.value)})}/></label><label className="field"><span>Subjects</span><input type="number" min="1" value={form.subjects} onChange={event=>setForm({...form,subjects:Number(event.target.value)})}/></label><label className="field"><span>Primary schedule</span><input value={form.schedule} onChange={event=>setForm({...form,schedule:event.target.value})}/></label><label className="field"><span>Status</span><select value={form.status} onChange={event=>setForm({...form,status:event.target.value})}><option>Active</option><option>Review</option></select></label></form></Modal>
  <Drawer open={!!selected} onClose={()=>setSelected(null)} eyebrow="Class profile" title={selected?`${selected.name} — ${selected.section}`:''}>{selected&&<div className="class-detail"><div className="class-detail-head"><span><GraduationCap/></span><div><h3>{selected.name} · Section {selected.section}</h3><p>{selected.teacher}</p></div></div><div className="detail-list"><div className="detail-row"><span>Class teacher</span><b>{selected.teacher}</b></div><div className="detail-row"><span>Students</span><b>{selected.students}</b></div><div className="detail-row"><span>Subjects</span><b>{selected.subjects}</b></div><div className="detail-row"><span>Room</span><b>{selected.room}</b></div><div className="detail-row"><span>Schedule</span><b>{selected.schedule}</b></div><div className="detail-row"><span>Status</span><b>{selected.status}</b></div></div><div className="class-subjects"><b>Core subjects</b><div>{courses.slice(0,Math.min(6,selected.subjects)).map(course=><span key={course.code}>{course.title}</span>)}</div></div><button className="btn-danger class-delete" onClick={()=>removeClass(selected)}><Trash2/> Delete class</button></div>}</Drawer>
 </>;
}

function TimetablePanel(){
 const[day,setDay]=useState('Wed');
 return <section className="portal-card timetable-panel"><div className="academic-day-tabs">{Object.keys(timetable).map(item=><button key={item} className={day===item?'active':''} onClick={()=>setDay(item)}>{item}</button>)}</div><div className="admin-schedule">{timetable[day].map(([time,subject,room,teacher],index)=><article key={`${time}-${subject}`}><span className="schedule-time">{time}</span><div className={`schedule-accent a-${index%4}`}/><div><b>{subject}</b><small><MapPin/> {room} <i/> {teacher}</small></div><button>Open class</button></article>)}</div></section>;
}

function AssignmentsPanel({state}){return <section className="portal-card"><div className="academic-summary-row"><Summary icon={ClipboardCheck} label="Coursework" value={state.assignments.length}/><Summary icon={Clock3} label="Pending review" value={state.assignments.filter(item=>item.status==='Submitted').length}/><Summary icon={CheckCircle2} label="Graded" value={state.assignments.filter(item=>item.status==='Graded').length}/></div><DataTable rows={state.assignments} pageSize={8} columns={[{key:'title',label:'Assignment'},{key:'subject',label:'Subject'},{key:'due',label:'Due Date'},{key:'priority',label:'Priority'},{key:'status',label:'Status',render:value=><span className={`status-pill ${value.toLowerCase()}`}>{value}</span>},{key:'score',label:'Score'}]}/></section>}

function ExamPanel(){
 const exams=[['Mathematics II','Sep 21','09:00 AM','Hall A','Grade 10'],['Physics','Sep 23','09:00 AM','Hall B','Grade 10'],['English Language','Sep 25','10:30 AM','Hall A','Grade 10'],['Computer Science','Sep 28','09:00 AM','Lab 1','Grade 10'],['Pakistan Studies','Sep 30','11:00 AM','Hall C','Grade 10']];
 return <div className="exam-grid">{exams.map(([subject,date,time,room,grade],index)=><article className="portal-card exam-card" key={subject}><span className={`exam-icon e-${index%4}`}><FileBadge/></span><small>{grade} · Mid-term</small><h3>{subject}</h3><div><CalendarDays/> {date}, 2026</div><div><Clock3/> {time}</div><div><MapPin/> {room}</div><button>View examination</button></article>)}</div>;
}

function ResultsPanel(){
 const rows=[['Mathematics',84,'A-'],['Physics',78,'B+'],['English',82,'A-'],['Computer Science',91,'A+'],['Pakistan Studies',76,'B+'],['Biology',88,'A']];
 return <div className="results-layout"><section className="portal-card result-overview"><div className="result-score"><BarChart3/><span>Term average</span><strong>83.2%</strong><small>Across Grade 10 subjects</small></div><div className="result-bars">{rows.map(([name,value])=><div key={name}><span>{name}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}%</strong></div>)}</div></section><section className="portal-card"><DataTable rows={rows.map((row,index)=>({id:index,subject:row[0],average:`${row[1]}%`,grade:row[2],students:26+index}))} columns={[{key:'subject',label:'Subject'},{key:'average',label:'Average'},{key:'grade',label:'Grade'},{key:'students',label:'Students'}]}/></section></div>;
}

function Summary({icon:Icon,label,value}){return <div><span><Icon/></span><div><small>{label}</small><b>{value}</b></div></div>}
