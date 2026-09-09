import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken} from '@/app/lib/session';

export async function GET(){
 const jar=await cookies();
 const session=verifySessionToken(jar.get('teklms_session')?.value||'');
 if(!session||session.role!=='admin')return NextResponse.json({ok:false,message:'Administrator access is required.'},{status:401});
 const configured=Boolean(process.env.RESEND_API_KEY);
 const testRecipient=process.env.RESEND_TEST_RECIPIENT||'';
 return NextResponse.json({ok:true,configured,from:process.env.RESEND_FROM||'TekLMS <onboarding@resend.dev>',mode:testRecipient?'Test inbox':'Direct student delivery',recipient:testRecipient||'Each student’s registered email',adminRecipient:testRecipient||process.env.RESEND_ADMIN_RECIPIENT||'Not configured'},{headers:{'Cache-Control':'no-store'}});
}
