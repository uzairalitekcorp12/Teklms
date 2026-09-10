import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken} from '@/app/lib/session';

export async function GET(){
  const jar=await cookies();
  const session=verifySessionToken(jar.get('teklms_session')?.value);
  if(!session||session.role!=='admin')return NextResponse.json({ok:false,message:'Administrator access is required.'},{status:401});

  const studentTenRecipient=process.env.RESEND_STUDENT_10_RECIPIENT||'m.uzair.tekcorp@gmail.com';
  const whatsAppNumber=String(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'923001234567').replace(/\D/g,'');
  return NextResponse.json({
    ok:true,
    email:{
      configured:Boolean(process.env.RESEND_API_KEY),
      from:process.env.RESEND_FROM||'TekLMS <onboarding@resend.dev>',
      mode:'Student 10 test delivery',
      recipient:studentTenRecipient,
      adminRecipient:process.env.RESEND_ADMIN_RECIPIENT||'Not configured'
    },
    whatsapp:{
      configured:Boolean(process.env.WHATSAPP_ACCESS_TOKEN&&process.env.WHATSAPP_PHONE_NUMBER_ID),
      sender:whatsAppNumber||'Not configured',
      mode:process.env.WHATSAPP_TEMPLATE_NAME?'Approved template':'Customer-service text',
      template:process.env.WHATSAPP_TEMPLATE_NAME||''
    }
  },{headers:{'Cache-Control':'no-store'}});
}
