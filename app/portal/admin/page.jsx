import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {verifySessionToken} from '@/app/lib/session';
import AdminPortal from '@/app/portal/admin/AdminPortal/AdminPortal';
export default async function Page(){const jar=await cookies();const session=verifySessionToken(jar.get('teklms_session')?.value);if(!session)redirect('/login');if(session.role!=='admin')redirect('/portal/student');return <AdminPortal/>}
