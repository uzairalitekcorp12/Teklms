import {EyeOff,KeyRound,LockKeyhole,ShieldCheck,UserRoundCheck,Video} from 'lucide-react';
import './SecureLearning.css';

const items=[
  {icon:LockKeyhole,title:'Protected media delivery',copy:'Amazon S3 or CloudFront lecture links open inside the guarded TekLMS player.'},
  {icon:UserRoundCheck,title:'Identity watermarking',copy:'A moving learner identity watermark stays on protected playback to discourage sharing.'},
  {icon:EyeOff,title:'Capture deterrence',copy:'Protected playback pauses on focus loss and blocks common save, inspect and capture shortcuts inside the player.'},
  {icon:KeyRound,title:'Session-controlled access',copy:'Lecture access is limited to the configured student audience and authenticated portal sessions.'}
];

export default function SecureLearning(){
  return <section className="secure-learning" id="security"><div className="container secure-learning-grid"><div className="secure-learning-copy reveal"><span className="eyebrow">Secure learning</span><h2 className="section-title">Recorded lectures with protection built into the experience.</h2><p className="section-copy">TekLMS keeps learning simple while adding practical safeguards for institutions publishing valuable course content.</p><div className="secure-learning-list">{items.map(({icon:Icon,title,copy})=><div key={title}><span><Icon/></span><div><b>{title}</b><p>{copy}</p></div></div>)}</div></div><div className="secure-learning-visual reveal" data-delay="2"><div className="secure-media-shell"><div className="secure-media-top"><span><ShieldCheck/> Protected lecture session</span><small>S3 / CloudFront ready</small></div><div className="secure-media-frame"><img src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Student learning through an online lecture"/><span className="secure-media-shade"/><div className="secure-media-play"><Video/></div><div className="secure-media-watermark">Student Account · ST-0010</div></div><div className="secure-media-bottom"><div><b>Featured course lecture</b><span>Amazon stream · Protected playback</span></div><div className="secure-media-progress"><i/></div></div></div><div className="security-float sf-one"><LockKeyhole/><div><b>Protected</b><span>Guarded playback</span></div></div><div className="security-float sf-two"><ShieldCheck/><div><b>Session verified</b><span>Access checked</span></div></div></div></div></section>;
}
