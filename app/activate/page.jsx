import {Suspense} from 'react';
import ActivationPage from '@/app/main-website-pages/ActivationPage/ActivationPage';
export default function Page(){return <Suspense fallback={<div style={{minHeight:'100vh',display:'grid',placeItems:'center'}}>Activating TekLMS…</div>}><ActivationPage/></Suspense>}
