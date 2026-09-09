import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {createSignedToken} from '@/app/lib/session';

const emailRx=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml=value=>String(value||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

export async function POST(request){
  try{
    const body=await request.json();
    const email=String(body.email||'').trim().toLowerCase();
    const name=String(body.name||'').trim();
    if(!name||!emailRx.test(email))return NextResponse.json({ok:false,message:'Enter a valid name and email address.'},{status:400});

    const otp=String(crypto.randomInt(100000,1000000));
    const otpHash=crypto.createHash('sha256').update(otp).digest('hex');
    const token=createSignedToken({type:'signup-otp',email,name,otpHash},10*60*1000);
    const apiKey=process.env.RESEND_API_KEY;
    const recipient=process.env.RESEND_TEST_RECIPIENT||email;
    const from=process.env.RESEND_FROM||'TekLMS <onboarding@resend.dev>';

    if(!apiKey)return NextResponse.json({ok:false,message:'Email verification is not configured. Add RESEND_API_KEY to your environment.'},{status:503});

    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({
      from,
      to:[recipient],
      subject:`TekLMS verification code — ${name}`,
      html:`<!doctype html><html><body style="margin:0;background:#07100b;font-family:Arial,sans-serif;color:#edf7f1"><div style="max-width:620px;margin:0 auto;padding:34px 18px"><div style="border:1px solid #1f3b2b;background:#0d1912;border-radius:22px;overflow:hidden"><div style="padding:26px 28px;border-bottom:1px solid #1f3b2b"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#58d58f;font-weight:700">TekLMS account verification</div><h1 style="font-size:25px;margin:8px 0 0;color:#ffffff">Confirm ${escapeHtml(name)}'s email</h1></div><div style="padding:28px"><p style="font-size:14px;line-height:1.7;color:#b8c9bf;margin:0 0 20px">A student signup request was created for <strong style="color:#fff">${escapeHtml(email)}</strong>. Use this one-time code to continue:</p><div style="font-size:36px;letter-spacing:.22em;font-weight:800;color:#68e29e;background:#07100b;border:1px solid #21462f;border-radius:16px;padding:18px;text-align:center">${otp}</div><p style="font-size:12px;line-height:1.6;color:#80958a;margin:20px 0 0">This code expires in 10 minutes. The account will still require administrator approval before portal access is enabled.</p></div></div></div></body></html>`
    })});
    if(!response.ok){const details=await response.text();console.error('Resend OTP error',response.status,details);return NextResponse.json({ok:false,message:'The verification email could not be sent. Check your Resend configuration.'},{status:502});}

    const res=NextResponse.json({ok:true,expiresIn:600});
    res.cookies.set('teklms_signup_otp',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:600});
    return res;
  }catch{return NextResponse.json({ok:false,message:'Unable to start email verification.'},{status:400})}
}
