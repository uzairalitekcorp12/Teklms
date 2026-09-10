import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken} from '@/app/lib/session';

const escapeHtml=value=>String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export async function POST(request){
  const jar=await cookies();
  const session=verifySessionToken(jar.get('teklms_session')?.value);
  if(!session||session.role!=='admin')return NextResponse.json({ok:false,message:'Administrator access is required.'},{status:401});

  try{
    const body=await request.json();
    const subject=String(body.subject||'').trim().slice(0,180);
    const message=String(body.message||'').trim().slice(0,6000);
    const recipients=(Array.isArray(body.recipients)?body.recipients:[])
      .filter(recipient=>recipient?.email)
      .map(recipient=>({name:String(recipient.name||'Student').slice(0,120),email:String(recipient.email).trim().slice(0,254)}))
      .slice(0,120);
    if(!subject||!message||!recipients.length)return NextResponse.json({ok:false,message:'Add a subject, message and at least one email recipient.'},{status:400});

    const apiKey=process.env.RESEND_API_KEY;
    if(!apiKey)return NextResponse.json({ok:false,configured:false,message:'Resend is not configured. Add RESEND_API_KEY and restart TekLMS.'},{status:503});

    const from=process.env.RESEND_FROM||'TekLMS <onboarding@resend.dev>';
    const testRecipient=process.env.RESEND_TEST_RECIPIENT||'';
    const targets=testRecipient?[{name:'Central inbox',email:testRecipient}]:recipients;
    const makeHtml=()=>`<!doctype html><html><body style="margin:0;background:#06110f;font-family:Arial,sans-serif;color:#ecfffb"><div style="max-width:640px;margin:0 auto;padding:34px 18px"><div style="border:1px solid #164e48;background:#0a1b18;border-radius:22px;overflow:hidden"><div style="padding:26px 28px;background:linear-gradient(135deg,#0f766e,#115e59)"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#99f6e4;font-weight:700">TekLMS communication</div><h1 style="font-size:25px;color:#fff;margin:9px 0 0">${escapeHtml(subject)}</h1></div><div style="padding:28px"><p style="font-size:14px;line-height:1.75;color:#c8e5df;margin:0;white-space:pre-line">${escapeHtml(message)}</p></div></div></div></body></html>`;

    const results=await Promise.allSettled(targets.map(target=>fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({from,to:[target.email],reply_to:process.env.RESEND_REPLY_TO||undefined,subject,html:makeHtml(target)})
    }).then(async response=>({ok:response.ok,status:response.status,body:await response.text()}))));
    const sent=results.filter(result=>result.status==='fulfilled'&&result.value.ok).length;
    const failed=targets.length-sent;
    return NextResponse.json({ok:sent>0,configured:true,testMode:Boolean(testRecipient),sent,failed,audienceCount:recipients.length,status:sent?(failed?'Partially accepted':'Accepted by provider'):'Failed',message:sent?'Email accepted for delivery.':'Email rejected. Check the Resend sender domain and recipient restrictions.'},{status:sent?200:502,headers:{'Cache-Control':'no-store'}});
  }catch{
    return NextResponse.json({ok:false,message:'Email delivery could not be completed.'},{status:400});
  }
}
