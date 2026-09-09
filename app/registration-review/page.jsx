import {Suspense} from 'react';
import RegistrationImportPage from '@/app/main-website-pages/RegistrationImportPage/RegistrationImportPage';
export default function Page(){return <Suspense fallback={<div style={{minHeight:'100vh',display:'grid',placeItems:'center'}}>Preparing registration…</div>}><RegistrationImportPage/></Suspense>}
