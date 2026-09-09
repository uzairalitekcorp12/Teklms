import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken} from '@/app/lib/session';
import crypto from 'node:crypto';
import meta from '@/app/data/secureMediaMeta.json';
import {secureMediaCiphertext} from '@/app/data/secureMediaPayload';

const key=crypto.createHash('sha256').update('TekLMS-V5-Protected-Lecture-Key-2026').digest();

export async function GET(_request,{params}){
  const jar=await cookies();
  const session=verifySessionToken(jar.get('teklms_session')?.value);
  if(!session)return NextResponse.json({message:'Authentication required.'},{status:401});
  const{id}=await params;
  if(!/^LEC-\d{3,}$/.test(id))return NextResponse.json({message:'Lecture not found.'},{status:404});
  try{
    const encrypted=Buffer.from(secureMediaCiphertext,'base64');
    const tag=encrypted.subarray(encrypted.length-16);
    const body=encrypted.subarray(0,encrypted.length-16);
    const decipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(meta.iv,'hex'));
    decipher.setAAD(Buffer.from(meta.aad));
    decipher.setAuthTag(tag);
    const decrypted=Buffer.concat([decipher.update(body),decipher.final()]);
    return new NextResponse(decrypted,{status:200,headers:{
      'Content-Type':meta.mime,
      'Content-Length':String(decrypted.length),
      'Content-Disposition':'inline',
      'Cache-Control':'private, no-store, no-cache, max-age=0, must-revalidate',
      'Pragma':'no-cache',
      'Expires':'0',
      'X-Content-Type-Options':'nosniff',
      'X-TekLMS-Protection':'encrypted-at-rest; authenticated-session; no-store'
    }});
  }catch(error){console.error('Secure media error',error);return NextResponse.json({message:'Unable to open this lecture.'},{status:500})}
}
