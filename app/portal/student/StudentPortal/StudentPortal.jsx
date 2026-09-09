"use client";
import {useState} from 'react';
import PortalShell from '../../_components/PortalShell/PortalShell';
import {studentModules} from '@/app/data/seedData';
import StudentOverview from '../StudentOverview/StudentOverview';
import CoursesView from '../CoursesView/CoursesView';
import ScheduleView from '../ScheduleView/ScheduleView';
import LecturesView from '../LecturesView/LecturesView';
import AssignmentsView from '../AssignmentsView/AssignmentsView';
import ResultsView from '../ResultsView/ResultsView';
import AttendanceView from '../AttendanceView/AttendanceView';
import FeesView from '../FeesView/FeesView';
import AnnouncementsView from '../AnnouncementsView/AnnouncementsView';
import ProfileView from '../ProfileView/ProfileView';
import LiveSessionsView from '../LiveSessionsView/LiveSessionsView';
import './StudentPortal.css';
export default function StudentPortal(){const[active,setActive]=useState('overview');const views={overview:<StudentOverview onNavigate={setActive}/>,courses:<CoursesView/>,lectures:<LecturesView/>,liveSessions:<LiveSessionsView/>,schedule:<ScheduleView/>,assignments:<AssignmentsView/>,results:<ResultsView/>,attendance:<AttendanceView/>,fees:<FeesView/>,announcements:<AnnouncementsView/>,profile:<ProfileView/>};return <PortalShell role="student" items={studentModules} active={active} onChange={setActive}><div className="student-view">{views[active]}</div></PortalShell>}
