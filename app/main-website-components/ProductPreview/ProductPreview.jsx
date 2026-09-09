import {LayoutDashboard,GraduationCap,Users,WalletCards,MessageCircle,BarChart3,Settings,Search,Plus,MoreHorizontal,Menu} from 'lucide-react';
import Image from 'next/image';
import BrandLogo from '@/app/_shared/BrandLogo/BrandLogo';
import './ProductPreview.css';
import './ProductPreviewMobile.css';

const navigation=[[LayoutDashboard,'Dashboard'],[GraduationCap,'Academic'],[Users,'Students'],[WalletCards,'Accounts'],[MessageCircle,'WhatsApp'],[BarChart3,'Reports'],[Settings,'Settings']];
const classRows=[
 ['Grade 9','A','6','28','Mrs. Sara'],
 ['Grade 9','B','6','26','Mr. Ali'],
 ['Grade 10','A','7','30','Ms. Hira'],
 ['Grade 10','B','7','27','Mr. Usman']
];
const labels=['Class','Section','Subjects','Students','Class Teacher'];

export default function ProductPreview(){
 return <section className="product-section" id="platform"><div className="container">
  <div className="product-heading reveal"><div><div className="eyebrow">A serious system, not another scattered tool</div><h2 className="section-title">Run the institution from one calm interface.</h2></div><p className="section-copy">TekLMS follows a clean, predictable hierarchy: navigation stays consistent, information is easy to scan, and each task lives where teams expect it.</p></div>
  <div className="product-window reveal" data-tilt>
   <aside><div className="side-brand"><Image src="/assets/teklms-mark.svg" width={28} height={28} alt=""/><span>TekLMS</span></div>{navigation.map(([Icon,label],index)=><div className={`fake-nav ${index===1?'active':''}`} key={label}><Icon size={16}/>{label}</div>)}</aside>
   <main>
    <div className="fake-top"><div className="fake-mobile-brand"><Menu/><BrandLogo/></div><div className="fake-search"><Search size={14}/> Search anything...</div><div className="fake-user"><span>AK</span><div><b>Ahmed Khan</b><small>Administrator</small></div></div></div>
    <div className="preview-body">
     <div className="preview-title"><div><h3>Academic</h3><p>Manage classes, subjects, timetable and student performance.</p></div><button type="button"><Plus size={15}/> Add Class</button></div>
     <div className="preview-tabs"><b>Classes</b><span>Timetable</span><span>Assignments</span><span>Exams</span><span>Results</span></div>
     <div className="preview-table">
      <div className="table-row head">{[...labels,'Action'].map(label=><span key={label}>{label}</span>)}</div>
      {classRows.map((row,index)=><div className="table-row" key={`${row[0]}-${row[1]}`}>{row.map((value,column)=><span data-label={labels[column]} key={labels[column]}>{value}</span>)}<span data-label="Action"><button type="button" className="view-btn">View</button><MoreHorizontal size={14}/></span></div>)}
     </div>
    </div>
   </main>
  </div>
 </div></section>
}
