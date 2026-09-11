import {LayoutDashboard,GraduationCap,Users,WalletCards,MessageCircle,BarChart3,Settings,Search,FileBarChart,TrendingUp,CalendarDays,Video,Radio,Menu,CheckCircle2,AlertCircle,Megaphone,ReceiptText} from 'lucide-react';
import Image from 'next/image';
import BrandLogo from '@/app/_shared/BrandLogo/BrandLogo';
import './ProductPreview.css';
import './ProductPreviewMobile.css';
import './ProductPreviewDashboard.css';

const navigation=[[LayoutDashboard,'Dashboard'],[GraduationCap,'Academic'],[Video,'Lectures'],[Radio,'Live Sessions'],[Users,'Students'],[WalletCards,'Accounts'],[MessageCircle,'Communication'],[BarChart3,'Reports'],[Settings,'Settings']];
const metrics=[[Users,'1,248','Active students','On track','students'],[CalendarDays,'18','Classes today','Today','classes'],[WalletCards,'PKR 2.4M','Fee collection','On track','fees'],[CheckCircle2,'94.2%','Attendance','On track','attendance']];
const quickActions=[[GraduationCap,'Academic workspace','Classes, timetable and results','academic'],[Users,'Student records','Admissions and profiles','students'],[ReceiptText,'Fee management','Payments and receipts','fees'],[MessageCircle,'Send message','Email and WhatsApp','messages']];
const snapshot=[[CheckCircle2,'Attendance recorded','94.2%','good'],[CalendarDays,'Classes scheduled','18','classes'],[Megaphone,'Announcements','04','announcements'],[AlertCircle,'Fee follow-ups','12','fees']];

export default function ProductPreview(){
 return <section className="product-section" id="platform"><div className="container">
  <div className="product-heading reveal"><div><div className="eyebrow">A serious system, not another scattered tool</div><h2 className="section-title">Run the institution from one calm interface.</h2></div><p className="section-copy">TekLMS follows a clean, predictable hierarchy: navigation stays consistent, information is easy to scan, and each task lives where teams expect it.</p></div>
  <div className="product-window reveal" data-tilt>
   <aside><div className="side-brand"><Image src="/assets/teklms-mark.svg" width={28} height={28} alt=""/><span>TekLMS</span></div>{navigation.map(([Icon,label],index)=><div className={`fake-nav ${index===0?'active':''}`} key={label}><Icon size={16}/>{label}</div>)}</aside>
   <main>
    <div className="fake-top"><div className="fake-mobile-brand"><Menu/><BrandLogo/></div><div className="fake-search"><Search size={14}/> Search anything...</div><div className="fake-user"><span>AK</span><div><b>Ahmed Khan</b><small>Administrator</small></div></div></div>
    <div className="preview-body dashboard-preview">
     <div className="preview-title"><div><h3>Dashboard</h3><p>A focused view of the activity moving across TekLMS.</p></div><button type="button"><FileBarChart size={15}/> View reports</button></div>
     <div className="preview-metrics">{metrics.map(([Icon,value,label,meta,tone])=><article className={`preview-stat-card ${tone}`} key={label}><span className="preview-stat-icon"><Icon size={16}/></span><div><small>{label}</small><b>{value}</b><em>{meta==='On track'&&<TrendingUp size={10}/>} {meta}</em></div></article>)}</div>
     <div className="preview-quick-actions">{quickActions.map(([Icon,title,copy,tone])=><article className={tone} key={title}><span><Icon size={15}/></span><div><b>{title}</b><small>{copy}</small></div></article>)}</div>
     <div className="preview-dashboard-grid">
      <section className="preview-activity"><header><div><b>Academic activity</b><small>Weekly engagement</small></div><span>+12.8%</span></header><div className="preview-chart">{[48,64,57,81,75,91,84].map((height,index)=><div key={index}><i style={{height:`${height}%`}}/><small>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index]}</small></div>)}</div></section>
      <section className="preview-snapshot"><header><div><b>Today’s snapshot</b><small>Operational highlights</small></div><CalendarDays size={16}/></header><div>{snapshot.map(([Icon,label,value,tone])=><p className={tone} key={label}><span><Icon size={12}/>{label}</span><b>{value}</b></p>)}</div></section>
     </div>
    </div>
   </main>
  </div>
 </div></section>
}
