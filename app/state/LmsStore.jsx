"use client";
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {initialStudents,initialClasses,initialPayments,initialMessages,initialAnnouncements,initialAssignments,defaultSettings,defaultProfile,initialLectures,initialLiveSessions} from '@/app/data/seedData';

const StoreContext=createContext(null);
const KEY='teklms-v6-state';
const LEGACY_KEY='teklms-v5-state';
const ACCOUNT_KEY='teklms-v6-approved-accounts';
const LEGACY_ACCOUNT_KEY='teklms-v5-approved-accounts';
const clone=value=>JSON.parse(JSON.stringify(value));
const nextId=(rows,prefix,digits)=>{const highest=rows.reduce((max,row)=>{const value=Number(String(row.id||'').replace(`${prefix}-`,''));return Number.isFinite(value)?Math.max(max,value):max},0);return `${prefix}-${String(highest+1).padStart(digits,'0')}`};
const defaults={schemaVersion:6,students:initialStudents,classes:initialClasses,payments:initialPayments,messages:initialMessages,announcements:initialAnnouncements,assignments:initialAssignments,lectures:initialLectures,liveSessions:initialLiveSessions,settings:defaultSettings,profile:defaultProfile,balance:20000,pendingRegistrations:[],approvedAccounts:[],notifications:[
 {id:'N-1',title:'New admission received',detail:'A new Grade 9 admission requires review.',time:'12 min',read:false,module:'students',audience:'admin'},
 {id:'N-2',title:'Fee collection updated',detail:'Seven payments were recorded this morning.',time:'38 min',read:false,module:'accounts',audience:'admin'},
 {id:'N-3',title:'Attendance report ready',detail:'Today’s attendance summary is available.',time:'1 hr',read:true,module:'reports',audience:'admin'},
 {id:'N-4',title:'Assignment due tomorrow',detail:'Physics — Waves & Oscillation worksheet is due tomorrow.',time:'2 hrs',read:false,module:'assignments',audience:'student',studentId:'ST-0010'},
 {id:'N-5',title:'New lecture available',detail:'Computer Science — Arrays and Indexing is ready to continue.',time:'Yesterday',read:true,module:'lectures',audience:'student',studentId:'ST-0010'}
]};

function mergeSavedState(saved,activated=[]){
 const base=clone(defaults);
 const parsed=saved&&typeof saved==='object'?saved:{};
 if(Array.isArray(parsed.students))parsed.students=parsed.students.map(student=>{const seed=base.students.find(row=>row.id===student.id);return {...seed,...student,courseCodes:student.courseCodes||seed?.courseCodes||[]}});
 const approved=[...(Array.isArray(parsed.approvedAccounts)?parsed.approvedAccounts:[]),...(Array.isArray(activated)?activated:[])].filter((item,index,rows)=>item?.email&&rows.findIndex(row=>row.email===item.email)===index);
 return {...base,...parsed,schemaVersion:6,approvedAccounts:approved,liveSessions:Array.isArray(parsed.liveSessions)?parsed.liveSessions:base.liveSessions,notifications:Array.isArray(parsed.notifications)?parsed.notifications:base.notifications,pendingRegistrations:Array.isArray(parsed.pendingRegistrations)?parsed.pendingRegistrations:[]};
}

export function LmsStoreProvider({children}){
 const[state,setState]=useState(()=>clone(defaults));
 const[hydrated,setHydrated]=useState(false);
 useEffect(()=>{
  try{
   const raw=localStorage.getItem(KEY)||localStorage.getItem(LEGACY_KEY);
   const accountRaw=localStorage.getItem(ACCOUNT_KEY)||localStorage.getItem(LEGACY_ACCOUNT_KEY);
   setState(mergeSavedState(raw?JSON.parse(raw):{},accountRaw?JSON.parse(accountRaw):[]));
  }catch{}
  setHydrated(true);
 },[]);
 useEffect(()=>{if(!hydrated)return;try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem(ACCOUNT_KEY,JSON.stringify(state.approvedAccounts||[]))}catch{}},[state,hydrated]);
 useEffect(()=>{const sync=event=>{if(event.key!==KEY||!event.newValue)return;try{setState(mergeSavedState(JSON.parse(event.newValue)))}catch{}};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[]);
 const patch=(key,updater)=>setState(previous=>({...previous,[key]:typeof updater==='function'?updater(previous[key]):updater}));
 const api=useMemo(()=>({state,hydrated,
  addStudent:student=>patch('students',rows=>[{...student,id:nextId(rows,'ST',4)},...rows]),
  updateStudent:(id,data)=>setState(previous=>{const updated={...data,id};return {...previous,students:previous.students.map(row=>row.id===id?{...row,...updated}:row),profile:previous.profile?.id===id?{...previous.profile,name:updated.name,email:updated.email,phone:updated.phone,guardian:updated.guardian,address:updated.address,grade:`${updated.className} — Section ${updated.section}`,courseCodes:updated.courseCodes||[]}:previous.profile,approvedAccounts:(previous.approvedAccounts||[]).map(account=>account.studentId===id?{...account,name:updated.name,className:updated.className,section:updated.section,courseCodes:updated.courseCodes||[]}:account)}}),
  deleteStudent:id=>setState(previous=>({...previous,students:previous.students.filter(row=>row.id!==id),approvedAccounts:(previous.approvedAccounts||[]).filter(account=>account.studentId!==id),notifications:previous.notifications.filter(note=>note.studentId!==id),liveSessions:(previous.liveSessions||[]).map(session=>{const recipientIds=(session.recipientIds||[]).filter(studentId=>studentId!==id);return {...session,recipientIds,recipientCount:recipientIds.length}})})),
  addClass:item=>patch('classes',rows=>[{...item,id:nextId(rows,'CLS',3)},...rows]),
  deleteClass:id=>patch('classes',rows=>rows.filter(row=>row.id!==id)),
  addPayment:item=>patch('payments',rows=>[{...item,id:nextId(rows,'PAY',4),receipt:`RC-${Date.now().toString().slice(-6)}`},...rows]),
  deletePayment:id=>patch('payments',rows=>rows.filter(row=>row.id!==id)),
  addMessage:item=>patch('messages',rows=>[{...item,id:`MSG-${Date.now()}`},...rows]),
  addAnnouncement:item=>patch('announcements',rows=>[{...item,id:`ANN-${Date.now()}`,read:false},...rows]),
  deleteAnnouncement:id=>patch('announcements',rows=>rows.filter(row=>row.id!==id)),
  markAnnouncementRead:id=>patch('announcements',rows=>rows.map(item=>item.id===id?{...item,read:true}:item)),
  submitAssignment:id=>patch('assignments',rows=>rows.map(item=>item.id===id?{...item,status:'Submitted'}:item)),
  addLecture:item=>patch('lectures',rows=>[{...item,id:nextId(rows,'LEC',3),progress:0,completed:false,secure:true},...rows]),
  updateLecture:(id,data)=>patch('lectures',rows=>rows.map(item=>item.id===id?{...item,...data}:item)),
  deleteLecture:id=>setState(previous=>({...previous,lectures:previous.lectures.filter(row=>row.id!==id),notifications:previous.notifications.filter(note=>note.lectureId!==id)})),
  updateLectureProgress:(id,progress)=>patch('lectures',rows=>rows.map(item=>item.id===id?{...item,progress:Math.max(0,Math.min(100,progress)),completed:progress>=98}:item)),
  sendLiveSession:item=>{const id=`LIVE-${Date.now()}`;const sentAt=new Date().toISOString();const session={...item,id,sentAt,status:'Sent'};const recipientNotifications=(item.recipientIds||[]).map((studentId,index)=>({id:`LN-${Date.now()}-${index}`,title:item.title||'Live class link received',detail:`${item.courseTitle}: ${item.message||'Your live class link is ready.'}`,time:'Now',read:false,module:'liveSessions',audience:'student',studentId,link:item.url,liveSessionId:id}));setState(previous=>({...previous,liveSessions:[session,...(previous.liveSessions||[])],notifications:[...recipientNotifications,...previous.notifications]}));return id},
  deleteLiveSession:id=>setState(previous=>({...previous,liveSessions:(previous.liveSessions||[]).filter(session=>session.id!==id),notifications:previous.notifications.filter(note=>note.liveSessionId!==id)})),
  submitRegistration:registration=>setState(previous=>{const exists=(previous.pendingRegistrations||[]).some(item=>item.requestId===registration.requestId||(item.email===registration.email&&item.status==='Pending'));if(exists)return previous;return {...previous,pendingRegistrations:[registration,...(previous.pendingRegistrations||[])],notifications:[{id:`REG-N-${Date.now()}`,title:'Student registration awaiting approval',detail:`${registration.name} verified ${registration.email} and requested ${registration.requestedGrade}.`,time:'Now',read:false,module:'registrations',audience:'admin',registrationId:registration.requestId},...previous.notifications]}}),
  approveRegistration:(id,{assignment,accountToken})=>{let createdId='';setState(previous=>{const registration=(previous.pendingRegistrations||[]).find(item=>item.requestId===id);if(!registration)return previous;createdId=nextId(previous.students,'ST',4);const student={id:createdId,name:registration.name,className:assignment.className,section:assignment.section,email:registration.email,phone:registration.phone||'',guardian:registration.guardian||'',attendance:100,score:0,status:'Active',fee:'Due',joined:new Date().toISOString().slice(0,10),address:'Karachi, Pakistan',courseCodes:assignment.courseCodes||[]};const account={email:registration.email,name:registration.name,studentId:createdId,accountToken,className:assignment.className,section:assignment.section,courseCodes:assignment.courseCodes||[],activatedAt:null};return {...previous,students:[student,...previous.students],approvedAccounts:[account,...(previous.approvedAccounts||[]).filter(item=>item.email!==registration.email)],pendingRegistrations:previous.pendingRegistrations.map(item=>item.requestId===id?{...item,status:'Approved',reviewedAt:new Date().toISOString(),studentId:createdId,assignment}:item),notifications:[{id:`APP-${Date.now()}`,title:'Registration approved',detail:`${registration.name} was added to ${assignment.className} — Section ${assignment.section}.`,time:'Now',read:false,module:'registrations',audience:'admin',registrationId:id},{id:`ST-APP-${Date.now()}`,title:'Your TekLMS account is approved',detail:`Your access to ${assignment.className} is ready.`,time:'Now',read:false,module:'overview',audience:'student',studentId:createdId,registrationId:id},...previous.notifications]}});return createdId},
  rejectRegistration:(id,reason='Registration was not approved.')=>setState(previous=>{const registration=(previous.pendingRegistrations||[]).find(item=>item.requestId===id);if(!registration)return previous;return {...previous,pendingRegistrations:previous.pendingRegistrations.map(item=>item.requestId===id?{...item,status:'Rejected',reviewedAt:new Date().toISOString(),reason}:item),notifications:[{id:`REJ-${Date.now()}`,title:'Registration reviewed',detail:`${registration.name}'s request was marked as rejected.`,time:'Now',read:false,module:'registrations',audience:'admin',registrationId:id},...previous.notifications]}}),
  deleteRegistration:id=>setState(previous=>({...previous,pendingRegistrations:(previous.pendingRegistrations||[]).filter(row=>row.requestId!==id),notifications:previous.notifications.filter(note=>note.registrationId!==id)})),
  updateSettings:data=>patch('settings',settings=>({...settings,...data})),
  updateProfile:data=>patch('profile',profile=>({...profile,...data})),
  updateBalance:value=>patch('balance',value),
  markNotificationRead:id=>patch('notifications',rows=>rows.map(note=>note.id===id?{...note,read:true}:note)),
  markAllNotificationsRead:()=>patch('notifications',rows=>rows.map(note=>({...note,read:true}))),
  resetWorkspace:()=>setState(clone(defaults))
 }),[state,hydrated]);
 return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export const useLmsStore=()=>{const value=useContext(StoreContext);if(!value)throw new Error('useLmsStore must be used inside LmsStoreProvider');return value};
