"use client";
import {useEffect,useState} from 'react';
import {Bell,Building2,Clock3,Mail,Moon,Palette,RotateCcw,Save,ShieldCheck,SlidersHorizontal,Sparkles,Sun} from 'lucide-react';
import PageHeading from '../../_components/PageHeading/PageHeading';
import {useLmsStore} from '@/app/state/LmsStore';
import {useTheme} from '@/app/state/ThemeContext';
import {useToast} from '@/app/_shared/Toast/Toast';
import './SettingsView.css';
import './AppearanceSettings.css';

export default function SettingsView(){
  const{state,updateSettings,resetWorkspace}=useLmsStore();
  const{theme,setTheme}=useTheme();
  const{toast}=useToast();
  const[tab,setTab]=useState('Institution');
  const[form,setForm]=useState(state.settings);
  useEffect(()=>setForm(state.settings),[state.settings]);

  const save=()=>{updateSettings(form);toast('Workspace settings and appearance saved.','success')};
  const toggle=key=>setForm(value=>({...value,[key]:!value[key]}));
  const reset=()=>{if(confirm('Reset workspace records and settings to their initial state?')){resetWorkspace();setTheme('dark');toast('Workspace restored.')}};
  const tabs=[['Institution',Building2],['Notifications',Bell],['Appearance',Palette],['Access',ShieldCheck],['Preferences',SlidersHorizontal]];

  return <>
    <PageHeading eyebrow="Workspace configuration" title="Settings" copy="Manage institution details, notifications, visual appearance and access preferences." action="Save Changes" onAction={save} hideExport secondary={<button type="button" className="settings-reset" onClick={reset}><RotateCcw/> Reset workspace</button>}/>
    <div className="settings-layout">
      <aside className="portal-card settings-nav">{tabs.map(([name,Icon])=><button type="button" className={tab===name?'active':''} onClick={()=>setTab(name)} key={name}><Icon/><span>{name}</span></button>)}</aside>
      <section className="portal-card settings-panel">
        {tab==='Institution'&&<Institution form={form} setForm={setForm}/>}
        {tab==='Notifications'&&<Notifications form={form} toggle={toggle}/>}
        {tab==='Appearance'&&<Appearance form={form} setForm={setForm} theme={theme} setTheme={setTheme}/>}
        {tab==='Access'&&<Access/>}
        {tab==='Preferences'&&<Preferences form={form} setForm={setForm}/>}
        <div className="settings-save-bar"><span>Save to keep these choices in this browser workspace.</span><button type="button" className="btn-primary" onClick={save}><Save/> Save Changes</button></div>
      </section>
    </div>
  </>;
}

function SectionHead({icon:Icon,title,copy}){return <div className="settings-section-head"><span><Icon/></span><div><h3>{title}</h3><p>{copy}</p></div></div>}

function Institution({form,setForm}){
  const set=(key,value)=>setForm(current=>({...current,[key]:value}));
  return <><SectionHead icon={Building2} title="Institution profile" copy="Core details used across the administrative workspace."/><div className="settings-form form-grid"><label className="field full"><span>Institution name</span><input value={form.institutionName} onChange={event=>set('institutionName',event.target.value)}/></label><label className="field"><span>Academic year</span><input value={form.academicYear} onChange={event=>set('academicYear',event.target.value)}/></label><label className="field"><span>Current term</span><input value={form.term} onChange={event=>set('term',event.target.value)}/></label><label className="field full"><span>Timezone</span><select value={form.timezone} onChange={event=>set('timezone',event.target.value)}><option>Asia/Karachi</option><option>Asia/Dubai</option><option>Europe/London</option><option>America/New_York</option></select></label></div></>;
}

function Notifications({form,toggle}){
  return <><SectionHead icon={Bell} title="Notifications" copy="Choose which alerts you want to receive."/><div className="toggle-list">{[['emailNotifications','Email notifications','Enable operational email delivery',Mail],['parentAlerts','Parent communication alerts','Show alerts related to parent communication',Bell],['attendanceAlerts','Attendance alerts','Highlight unusual attendance movement',Clock3],['feeReminders','Fee reminders','Surface outstanding account follow-ups',Bell],['weeklySummary','Weekly summary','Prepare a weekly operational summary',SlidersHorizontal]].map(([key,title,copy,Icon])=><Toggle key={key} icon={Icon} title={title} copy={copy} value={form[key]} onClick={()=>toggle(key)}/>)}</div></>;
}

function Appearance({form,setForm,theme,setTheme}){
  const set=(key,value)=>{
    setForm(current=>({...current,[key]:value}));
    const attribute={glassEffects:'glass',gradientText:'gradient',workspaceDensity:'density'}[key];
    if(attribute)document.documentElement.dataset[attribute]=key==='workspaceDensity'?value:(value?'on':'off');
  };
  return <><SectionHead icon={Palette} title="Appearance" copy="A teal, black and white visual system with optional glass surfaces and gradient typography."/><div className="appearance-settings">
    <div className="appearance-group"><div><b>Theme</b><small>Switch the complete website and both portals.</small></div><div className="appearance-options two"><button type="button" className={theme==='dark'?'active':''} onClick={()=>setTheme('dark')}><Moon/><span>Dark</span><small>Black + teal</small></button><button type="button" className={theme==='light'?'active':''} onClick={()=>setTheme('light')}><Sun/><span>Light</span><small>White + teal</small></button></div></div>
    <div className="appearance-group"><div><b>Surface style</b><small>Choose glass depth or crisp solid panels.</small></div><div className="appearance-options two"><button type="button" className={form.glassEffects!==false?'active':''} onClick={()=>set('glassEffects',true)}><Sparkles/><span>Glass</span><small>Blurred depth</small></button><button type="button" className={form.glassEffects===false?'active':''} onClick={()=>set('glassEffects',false)}><ShieldCheck/><span>Solid</span><small>Maximum clarity</small></button></div></div>
    <div className="appearance-group"><div><b>Typography</b><small>Use premium teal gradient headings or flat text.</small></div><Toggle icon={Sparkles} title="Gradient headings" copy="Applies to page and section titles across TekLMS." value={form.gradientText!==false} onClick={()=>set('gradientText',form.gradientText===false)}/></div>
    <div className="appearance-group"><div><b>Information density</b><small>Control how much space portal records use.</small></div><div className="density-switch"><button type="button" className={form.workspaceDensity!=='compact'?'active':''} onClick={()=>set('workspaceDensity','comfortable')}>Comfortable</button><button type="button" className={form.workspaceDensity==='compact'?'active':''} onClick={()=>set('workspaceDensity','compact')}>Compact</button></div></div>
  </div></>;
}

function Access(){return <><SectionHead icon={ShieldCheck} title="Access control" copy="Review the role structure used across TekLMS."/><div className="access-grid"><div><span>Administrator</span><b>Full workspace access</b><p>Academic, students, accounts, communication, reports and settings.</p></div><div><span>Academic Staff</span><b>Academic operations</b><p>Classes, student records, attendance, coursework and results.</p></div><div><span>Accounts Staff</span><b>Finance operations</b><p>Fee structures, payments, receipts and finance reports.</p></div><div><span>Student</span><b>Personal learning access</b><p>Assigned courses, lectures, live classes, records and fees.</p></div></div></>}

function Preferences({form,setForm}){const set=(key,value)=>setForm(current=>({...current,[key]:value}));return <><SectionHead icon={SlidersHorizontal} title="Workspace preferences" copy="Set working preferences for your administrative experience."/><div className="settings-form form-grid"><label className="field"><span>Default landing view</span><select defaultValue="Dashboard"><option>Dashboard</option><option>Academic</option><option>Students</option></select></label><label className="field"><span>Rows per page</span><select defaultValue="10 rows"><option>10 rows</option><option>20 rows</option><option>50 rows</option></select></label><label className="field full"><span>Profile visibility</span><select value={form.profileVisibility?'Visible':'Limited'} onChange={event=>set('profileVisibility',event.target.value==='Visible')}><option>Visible</option><option>Limited</option></select></label></div></>}

function Toggle({icon:Icon,title,copy,value,onClick}){return <button type="button" className="setting-toggle-row" onClick={onClick}><span className="setting-row-icon"><Icon/></span><div><b>{title}</b><small>{copy}</small></div><i className={value?'on':''}><em/></i></button>}
