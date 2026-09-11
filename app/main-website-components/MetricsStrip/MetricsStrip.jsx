import {BookOpen,UsersRound,WalletCards,MessageCircleMore} from 'lucide-react';import './MetricsStrip.css';
const items=[[BookOpen,'12+','Academic workflows'],[UsersRound,'12K+','Student records'],[WalletCards,'360°','Fee visibility'],[MessageCircleMore,'1-click','Communication access']];
export default function MetricsStrip(){return <section className="metrics-wrap"><div className="container metrics-grid">{items.map(([Icon,n,t],i)=><div className="metric reveal" data-delay={String(i)} key={t}><Icon/><div><strong>{n}</strong><span>{t}</span></div></div>)}</div></section>}
