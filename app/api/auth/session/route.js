import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken} from '@/app/lib/session';
export async function GET(){const jar=await cookies();const session=verifySessionToken(jar.get('teklms_session')?.value);if(!session)return NextResponse.json({authenticated:false},{status:401});return NextResponse.json({authenticated:true,role:session.role,username:session.username,studentId:session.studentId||null,name:session.name||null},{headers:{'Cache-Control':'no-store'}})}
