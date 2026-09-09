import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken,verifySignedToken,createSignedToken} from '@/app/lib/session';

const escapeHtml=value=>String(value||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
export async function POST(request){
  const jar=await cookies();const session=verifySessionToken(jar.get('teklms_session')?.value||'');
  if(!session||session.role!=='admin')return NextResponse.json({ok:false,message:'Administrator access is required.'},{status:401});
  try{
    const body=await request.json();
    const reg=verifySignedToken(body.registrationToken||'');
    if(!reg||reg.type!=='registration')return NextResponse.json({ok:false,message:'Registration record could not be verified.'},{status:400});
    const status=body.status==='Approved'?'Approved':'Rejected';
    const assignment=body.assignment||{};
    const apiKey=process.env.RESEND_API_KEY;const recipient=process.env.RESEND_TEST_RECIPIENT||reg.email;const from=process.env.RESEND_FROM||'TekLMS <onboarding@resend.dev>';
    let accountToken='';
    if(status==='Approved')accountToken=createSignedToken({type:'approved-student',role:'student',name:reg.name,email:reg.email,phone:reg.phone,guardian:reg.guardian,passwordHash:reg.passwordHash,studentId:String(body.studentId||''),className:String(assignment.className||reg.requestedGrade),section:String(assignment.section||''),courseCodes:Array.isArray(assignment.courseCodes)?assignment.courseCodes:[]},365*24*60*60*1000);
    if(!apiKey)return NextResponse.json({ok:true,emailConfigured:false,accountToken});
    const origin=request.headers.get('origin')||process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
    const activationUrl=status==='Approved'?`${origin}/activate?token=${encodeURIComponent(accountToken)}`:'';
    const subject=status==='Approved'?'Your TekLMS account has been approved':'Update on your TekLMS account request';
    const bodyText=status==='Approved'?`Your account for ${reg.email} has been approved for ${escapeHtml(assignment.className||reg.requestedGrade)}${assignment.section?` — Section ${escapeHtml(assignment.section)}`:''}.`:`Your account request for ${reg.email} was reviewed and is not active at this time.`;
    const html=`<!doctype html><html><body style="margin:0;background:#07100b;font-family:Arial,sans-serif;color:#edf7f1"><div style="max-width:620px;margin:0 auto;padding:34px 18px"><div style="border:1px solid #1f3b2b;background:#0d1912;border-radius:22px;overflow:hidden"><div style="padding:26px 28px"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#58d58f;font-weight:700">TekLMS account status</div><h1 style="font-size:25px;color:#fff;margin:9px 0 14px">${status==='Approved'?'Access approved':'Registration reviewed'}</h1><p style="font-size:14px;line-height:1.7;color:#b8c9bf">${bodyText}</p>${status==='Approved'?`<a href="${activationUrl}" style="display:inline-block;margin-top:12px;background:#45c582;color:#06130c;text-decoration:none;font-weight:800;padding:13px 18px;border-radius:11px">Activate this student account</a><p style="font-size:12px;color:#80958a;line-height:1.6;margin-top:18px">Open this link on the device where the student will use TekLMS. After activation, sign in with the registered email and chosen password.</p>`:''}</div></div></div></body></html>`;
    const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[recipient],subject,html})});
    return NextResponse.json({ok:true,emailConfigured:true,emailSent:sent.ok,accountToken});
  }catch{return NextResponse.json({ok:false,message:'Unable to send this account update.'},{status:400})}
}
