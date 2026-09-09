import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {verifySessionToken} from '@/app/lib/session';
import StudentPortal from '@/app/portal/student/StudentPortal/StudentPortal';
export default async function Page(){const jar=await cookies();const session=verifySessionToken(jar.get('teklms_session')?.value);if(!session)redirect('/login');if(session.role!=='student')redirect('/portal/admin');return <StudentPortal/>}
