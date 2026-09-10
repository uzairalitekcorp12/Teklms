"use client";
import {ArrowRight,Bell,BookOpen,ClipboardCheck,FileText,Trophy,UserCheck} from 'lucide-react';
import StatCard from '../../_components/StatCard/StatCard';
import {courses,timetable} from '@/app/data/seedData';
import {useLmsStore} from '@/app/state/LmsStore';
import './StudentOverview.css';

export default function StudentOverview({onNavigate}){
  const{state}=useLmsStore();
  const today=timetable.Wed;
  const assigned=state.profile?.courseCodes||[];
  const myCourses=courses.filter(course=>assigned.includes(course.code));
  const firstName=(state.profile?.name||'Student').split(' ')[0];
  const finishedAssignments=state.assignments.filter(assignment=>assignment.status!=='Pending').length;

  return <>
    <section className="student-welcome"><div><span>{state.profile?.grade||'Student workspace'} · Wednesday, 9 September 2026</span><h1>Good afternoon, {firstName}</h1><p>Your classes, coursework, progress and important updates are organized here for the day ahead.</p><button type="button" onClick={()=>onNavigate('schedule')}>View today’s schedule <ArrowRight/></button></div><div className="term-progress"><div className="progress-ring"><b>78%</b><small>Term progress</small></div><span>Fall Term · Week 7 of 9</span></div></section>
    <div className="student-overview-stats"><StatCard icon={BookOpen} label="Active Courses" value={myCourses.length} meta="Assigned this term" onClick={()=>onNavigate('courses')}/><StatCard icon={ClipboardCheck} label="Assignments" value={`${finishedAssignments} / ${state.assignments.length}`} meta="Completed or submitted" tone="green" onClick={()=>onNavigate('assignments')}/><StatCard icon={UserCheck} label="Attendance" value="94%" meta="Above requirement" tone="blue" onClick={()=>onNavigate('attendance')}/><StatCard icon={Trophy} label="Average Grade" value="A-" meta="83.2% overall" tone="orange" onClick={()=>onNavigate('results')}/></div>
    <div className="student-dashboard-grid"><section className="student-card overview-courses"><SectionTitle title="My courses" action="View all" onClick={()=>onNavigate('courses')}/>{myCourses.length?myCourses.slice(0,4).map(course=><button type="button" className="overview-course-row" key={course.code} onClick={()=>onNavigate('courses')}><span className={`overview-course-badge ${course.color}`}>{course.code.split('-')[0]}</span><div><b>{course.title}</b><small>{course.teacher}</small></div><div className="overview-course-progress"><span>{course.progress}%</span><i><em style={{width:`${course.progress}%`}}/></i></div><ArrowRight/></button>):<div className="empty-state"><b>No courses assigned</b><p>Ask the administrator to enrol this account in a course.</p></div>}</section><section className="student-card today-schedule"><SectionTitle title="Today’s schedule" action="Full schedule" onClick={()=>onNavigate('schedule')}/><div className="today-list">{today.slice(0,4).map(([time,subject,room,teacher],index)=><button type="button" key={`${time}-${subject}`} onClick={()=>onNavigate('schedule')}><span>{time}</span><i className={`schedule-dot s-${index}`}/><div><b>{subject}</b><small>{room} · {teacher}</small></div></button>)}</div></section></div>
    <div className="student-dashboard-grid lower"><section className="student-card"><SectionTitle title="Upcoming assignments" action="All assignments" onClick={()=>onNavigate('assignments')}/><div className="overview-assignment-list">{state.assignments.filter(assignment=>assignment.status==='Pending').slice(0,4).map(assignment=><button type="button" key={assignment.id} onClick={()=>onNavigate('assignments')}><span><FileText/></span><div><b>{assignment.title}</b><small>{assignment.subject} · Due {assignment.due}</small></div><em>{assignment.priority}</em></button>)}</div></section><section className="student-card"><SectionTitle title="Announcements" action="View all" onClick={()=>onNavigate('announcements')}/><div className="overview-announcements">{state.announcements.slice(0,4).map(announcement=><button type="button" key={announcement.id} onClick={()=>onNavigate('announcements')}><span><Bell/></span><div><b>{announcement.title}</b><small>{announcement.meta}</small></div>{!announcement.read&&<i/>}</button>)}</div></section></div>
  </>;
}

function SectionTitle({title,action,onClick}){return <div className="student-section-title"><b>{title}</b>{action&&<button type="button" onClick={onClick}>{action}<ArrowRight/></button>}</div>}
