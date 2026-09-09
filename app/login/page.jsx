import { Suspense } from 'react';
import LoginPage from '@/app/main-website-pages/LoginPage/LoginPage';

export default function Page(){
  return <Suspense fallback={<div style={{minHeight:'100vh',display:'grid',placeItems:'center'}}>Loading TekLMS…</div>}><LoginPage/></Suspense>
}
