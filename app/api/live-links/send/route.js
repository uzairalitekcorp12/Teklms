import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken} from '@/app/lib/session';

const escapeHtml=value=>String(value||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const isYouTubeUrl=value=>{try{const url=new URL(value);return ['youtube.com','www.youtube.com','m.youtube.com','youtu.be'].includes(url.hostname)}catch{return false}};

export async function POST(request){
  const jar=await cookies();
  const session=verifySessionToken(jar.get('teklms_session')?.value);
  if(!session||session.role!=='admin')return NextResponse.json({ok:false,message:'Administrator access is required.'},{status:401});
  try{
    const body=await request.json();
    const title=String(body.title||'').trim();
    const courseTitle=String(body.courseTitle||'').trim();
    const url=String(body.url||'').trim();
    const message=String(body.message||'').trim();
    const recipients=Array.isArray(body.recipients)?body.recipients.filter(r=>r?.email).map(r=>({id:String(r.id||'').trim(),name:String(r.name||'Student').slice(0,120),email:String(r.email).trim().slice(0,254)})).slice(0,120):[];
    if(!title||!courseTitle||!isYouTubeUrl(url)||!recipients.length)return NextResponse.json({ok:false,message:'Complete the session details and select at least one recipient.'},{status:400});

    const apiKey=process.env.RESEND_API_KEY;
    const from=process.env.RESEND_FROM||process.env.TEKLMS_EMAIL_FROM||'TekLMS <onboarding@resend.dev>';
    const studentTen=recipients.filter(recipient=>recipient.id==='ST-0010');
    if(!studentTen.length)return NextResponse.json({ok:false,message:'Email testing is enabled for Student 10 only.'},{status:422});
    const testRecipient=process.env.RESEND_STUDENT_10_RECIPIENT||'m.uzair.tekcorp@gmail.com';
    if(!apiKey)return NextResponse.json({ok:false,emailConfigured:false,status:'setup required',sent:0,failed:studentTen.length,recipientCount:recipients.length,message:'Resend is not configured. Add RESEND_API_KEY and restart TekLMS.'},{status:503,headers:{'Cache-Control':'no-store'}});

    const subject=`${courseTitle}: ${title}`;
    const html=`<!doctype html><html><body style="margin:0;background:#f4f7f5;font-family:Arial,sans-serif;color:#16211a"><div style="max-width:620px;margin:0 auto;padding:32px 18px"><div style="background:#ffffff;border:1px solid #e0e8e3;border-radius:18px;overflow:hidden"><div style="padding:24px 26px;background:#143d2a;color:#ffffff"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.75">TekLMS Live Class</div><h1 style="font-size:24px;margin:8px 0 0">${escapeHtml(title)}</h1></div><div style="padding:26px"><p style="font-size:14px;line-height:1.7;margin:0 0 6px"><strong>${escapeHtml(courseTitle)}</strong></p><p style="font-size:14px;line-height:1.7;color:#5f6d64;margin:0 0 20px">${escapeHtml(message||'Your live class is ready.')}</p><a href="${escapeHtml(url)}" style="display:inline-block;background:#1f6b48;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 18px;border-radius:10px">Join Live Class</a><p style="font-size:12px;line-height:1.6;color:#819087;margin:22px 0 0">You can also open this session from the Live Classes area in your TekLMS student portal.</p></div></div></div></body></html>`;

    const results=await Promise.allSettled(studentTen.map(()=>fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[testRecipient],subject,html})}).then(async response=>({ok:response.ok,status:response.status,body:await response.text()}))));
    const sent=results.filter(result=>result.status==='fulfilled'&&result.value.ok).length;
    const failed=studentTen.length-sent;
    return NextResponse.json({ok:sent>0,emailConfigured:true,status:sent?(failed?'Partially accepted':'Accepted by provider'):'Failed',sent,failed,recipientCount:recipients.length,message:sent?'Live-class email accepted for delivery.':'Resend rejected the live-class email. Check the sender and destination configuration.'},{status:sent?200:502,headers:{'Cache-Control':'no-store'}})
  }catch{
    return NextResponse.json({ok:false,message:'Live session delivery could not be completed.'},{status:400,headers:{'Cache-Control':'no-store'}})
  }
}
