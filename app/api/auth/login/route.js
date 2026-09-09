import {NextResponse} from 'next/server';
import {createSessionToken} from '@/app/lib/session';
const accounts={
  'teklms@admin':{username:'Teklms@admin',password:'Temp123$',role:'admin'},
  'teklms@student':{username:'Teklms@student',password:'Temp123$',role:'student'}
};
export async function POST(request){try{const{username,password}=await request.json();const key=String(username||'').trim().toLowerCase();const account=accounts[key];if(!account||account.password!==password)return NextResponse.json({ok:false,message:'The email or password is incorrect.'},{status:401});const token=createSessionToken(account);const response=NextResponse.json({ok:true,role:account.role,username:account.username});response.cookies.set('teklms_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});return response}catch{return NextResponse.json({ok:false,message:'Unable to sign in right now.'},{status:400})}}
