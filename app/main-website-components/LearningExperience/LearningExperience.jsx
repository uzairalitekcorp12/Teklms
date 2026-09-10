import {Activity,CheckCircle2,Layers3,Clock3,UsersRound} from 'lucide-react';
import {pexels} from '@/app/data/seedData';
import './LearningExperience.css';

export default function LearningExperience(){
  return <section className="learning-experience">
    <div className="container learning-grid">
      <div className="learning-visual reveal">
        <figure className="learning-image main-photo"><img src={pexels.classroom} alt="Students studying in a classroom"/></figure>
        <figure className="learning-image sub-photo"><img src={pexels.teamwork} alt="Students collaborating around laptops"/></figure>
        <div className="learning-float"><div className="learning-signal"><span className="learning-signal-icon"><Activity/></span><span className="learning-signal-bars"><i></i><i></i><i></i><i></i></span><small>LIVE</small></div><div><b>Students stay connected</b><small>Courses, updates and records in one portal</small></div></div>
      </div>
      <div className="learning-copy reveal" data-delay="2">
        <div className="eyebrow">Designed around real learning</div>
        <h2 className="section-title">The portal should feel useful before it feels impressive.</h2>
        <p className="section-copy">TekLMS keeps the experience focused on what people need to do next. Students see their learning day. Administrators see the institution. Both use the same visual language.</p>
        <div className="learning-points">
          <div><span><Layers3/></span><p><b>Clear information hierarchy</b><small>Important actions and current status are surfaced before secondary details.</small></p></div>
          <div><span><Clock3/></span><p><b>Less time hunting for records</b><small>Consistent cards, tables, tabs and navigation make the interface predictable.</small></p></div>
          <div><span><UsersRound/></span><p><b>Built for different roles</b><small>Admin and student experiences share a system without sharing unnecessary complexity.</small></p></div>
        </div>
        <div className="learning-checks"><span><CheckCircle2/> Responsive</span><span><CheckCircle2/> Searchable</span><span><CheckCircle2/> Role-aware</span></div>
      </div>
    </div>
  </section>
}
