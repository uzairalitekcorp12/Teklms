"use client";
import {useState} from 'react';
import {BookOpen,PlayCircle,ArrowRight,FileText,Clock3,UserRound,CheckCircle2} from 'lucide-react';
import Drawer from '@/app/_shared/Drawer/Drawer';
import {courses} from '@/app/data/seedData';
import {useLmsStore} from '@/app/state/LmsStore';
import './CoursesView.css';

export default function CoursesView(){
 const[selected,setSelected]=useState(null);
 const{state}=useLmsStore();
 const assigned=state.profile?.courseCodes||[];
 const visible=courses.filter(course=>assigned.includes(course.code));
 return <><Header count={visible.length}/>{visible.length?<div className="student-course-grid">{visible.map((course,index)=><button className="student-card course-card-v3" key={course.code} onClick={()=>setSelected(course)}><div className={`course-cover-v3 c-${index}`}><span>{course.code}</span><BookOpen/></div><div className="course-card-body"><small>{course.teacher}</small><h3>{course.title}</h3><p>{course.description}</p><div className="course-progress-label"><span>Course progress</span><b>{course.progress}%</b></div><i className="course-progress-track"><em style={{width:`${course.progress}%`}}/></i><div className="course-footer"><span>{course.completed}/{course.lessons} lessons</span><b>Open course <ArrowRight/></b></div></div></button>)}</div>:<div className="empty-state"><b>No courses assigned</b><p>Your administrator must enrol you in a course before it appears here.</p></div>}<Drawer open={!!selected} onClose={()=>setSelected(null)} eyebrow="Course workspace" title={selected?.title||''} width="580px">{selected&&<div className="course-drawer"><div className="course-drawer-hero"><span><BookOpen/></span><div><small>{selected.code}</small><h3>{selected.title}</h3><p>{selected.teacher}</p></div></div><p className="course-description">{selected.description}</p><div className="course-drawer-metrics"><div><Clock3/><span>Progress</span><b>{selected.progress}%</b></div><div><CheckCircle2/><span>Lessons completed</span><b>{selected.completed}/{selected.lessons}</b></div><div><UserRound/><span>Instructor</span><b>{selected.teacher}</b></div></div><div className="resource-list"><b>Course resources</b>{selected.resources.map(resource=><button key={resource}><FileText/><span>{resource}</span><ArrowRight/></button>)}</div><button className="continue-course"><PlayCircle/> Continue learning</button></div>}</Drawer></>
}

function Header({count}){return <div className="student-page-heading"><div><span>Learning</span><h1>My Courses</h1><p>{count} assigned courses with progress, resources and lecture access.</p></div><button><BookOpen/> Resource Library</button></div>}
