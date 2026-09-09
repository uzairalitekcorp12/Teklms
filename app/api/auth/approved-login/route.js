import {NextResponse} from 'next/server';
import crypto from 'node:crypto';
import {createSessionToken,verifySignedToken} from '@/app/lib/session';

export async function POST(request){
  try{
    const {accountToken,password}=await request.json();
    const account=verifySignedToken(accountToken||'');
    if(!account||account.type!=='approved-student'||account.role!=='student')return NextResponse.json({ok:false,message:'This student account is not active.'},{status:401});
    const hash=crypto.createHash('sha256').update(String(password||'')).digest('hex');
    if(hash!==account.passwordHash)return NextResponse.json({ok:false,message:'The email or password is incorrect.'},{status:401});
    const session=createSessionToken({role:'student',username:account.email,studentId:account.studentId,name:account.name});
    const response=NextResponse.json({ok:true,role:'student',username:account.email,studentId:account.studentId,name:account.name,profile:{name:account.name,id:account.studentId,grade:`${account.className}${account.section?` — Section ${account.section}`:''}`,email:account.email,phone:account.phone||'',guardian:account.guardian||'',address:'Karachi, Pakistan',courseCodes:account.courseCodes||[]},courseCodes:account.courseCodes||[]});
    response.cookies.set('teklms_session',session,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});
    return response;
  }catch{return NextResponse.json({ok:false,message:'Unable to sign in right now.'},{status:400})}
}
