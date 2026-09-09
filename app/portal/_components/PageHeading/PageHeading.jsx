import {Plus,Download} from 'lucide-react';
import './PageHeading.css';
export default function PageHeading({eyebrow,title,copy,action='Add New',onAction,onExport,hideExport=false,secondary}){return <div className="page-heading"><div className="page-heading-copy"><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div><div className="page-heading-actions">{secondary}{!hideExport&&<button className="ghost-action" onClick={onExport}><Download/> Export</button>}{action&&<button className="primary-action" onClick={onAction}><Plus/> {action}</button>}</div></div>}
