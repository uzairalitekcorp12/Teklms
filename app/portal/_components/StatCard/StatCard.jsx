import {TrendingUp,ArrowUpRight} from 'lucide-react';
import './StatCard.css';
export default function StatCard({icon:Icon,label,value,meta,tone='blue',onClick,interactive=true}){const Tag=onClick?'button':'article';return <Tag className={`stat-card ${onClick&&interactive?'is-clickable':''}`} onClick={onClick}><div className={`stat-icon ${tone}`}><Icon/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small><TrendingUp/> {meta}</small></div>{onClick&&<ArrowUpRight className="stat-open"/>}</Tag>}
