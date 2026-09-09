import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import crypto from 'node:crypto';
import {verifySignedToken,createSignedToken} from '@/app/lib/session';

export async function POST(request){
  try{
    const {email,otp,registration}=await request.json();
    const jar=await cookies();
    const token=verifySignedToken(jar.get('teklms_signup_otp')?.value||'');
    if(!token||token.type!=='signup-otp')return NextResponse.json({ok:false,message:'The verification code expired. Request a new code.'},{status:401});
    const normalized=String(email||'').trim().toLowerCase();
    const otpHash=crypto.createHash('sha256').update(String(otp||'')).digest('hex');
    if(normalized!==token.email||otpHash!==token.otpHash)return NextResponse.json({ok:false,message:'The verification code is incorrect.'},{status:401});
    const safe={
      requestId:`REG-${Date.now().toString().slice(-9)}`,
      name:String(registration?.name||token.name||'').trim(),
      email:normalized,
      phone:String(registration?.phone||'').trim(),
      guardian:String(registration?.guardian||'').trim(),
      requestedGrade:String(registration?.requestedGrade||'').trim(),
      requestedCourse:String(registration?.requestedCourse||'').trim(),
      passwordHash:String(registration?.passwordHash||''),
      submittedAt:new Date().toISOString()
    };
    if(!safe.name||!safe.passwordHash||!safe.requestedGrade)return NextResponse.json({ok:false,message:'Complete the signup form before verification.'},{status:400});
    const registrationToken=createSignedToken({type:'registration',...safe},30*24*60*60*1000);
    const apiKey=process.env.RESEND_API_KEY;
    const recipient=process.env.RESEND_TEST_RECIPIENT||process.env.RESEND_ADMIN_RECIPIENT||'';
    const from=process.env.RESEND_FROM||'TekLMS <onboarding@resend.dev>';
    if(apiKey&&recipient){
      const origin=request.headers.get('origin')||process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
      const reviewUrl=`${origin}/registration-review?token=${encodeURIComponent(registrationToken)}`;
      await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[recipient],subject:`TekLMS registration awaiting approval — ${safe.name}`,html:`<!doctype html><html><body style="margin:0;background:#050806;font-family:Arial,sans-serif;color:#f3fff7"><div style="max-width:620px;margin:0 auto;padding:34px 18px"><div style="background:#0b1510;border:1px solid #1d3928;border-radius:22px;padding:28px"><div style="font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:#60d994;font-weight:700">TekLMS administrator notification</div><h1 style="font-size:24px;color:#fff;margin:9px 0 14px">New verified student registration</h1><p style="font-size:14px;line-height:1.7;color:#a6b8ad"><strong style="color:#fff">${safe.name}</strong> verified <strong style="color:#fff">${safe.email}</strong> and requested ${safe.requestedGrade}.</p><a href="${reviewUrl}" style="display:inline-block;margin-top:12px;background:#49cf85;color:#06130c;text-decoration:none;font-weight:800;padding:13px 18px;border-radius:11px">Add request to administrator workspace</a><p style="font-size:12px;line-height:1.6;color:#7f9387;margin-top:18px">Open the link on the browser used for TekLMS administration, then review the request under Registrations.</p></div></div></body></html>`})}).catch(()=>{});
    }
    const res=NextResponse.json({ok:true,registration:{...safe,registrationToken,status:'Pending'}});
    res.cookies.delete('teklms_signup_otp');
    return res;
  }catch{return NextResponse.json({ok:false,message:'Unable to verify this signup request.'},{status:400})}
}
