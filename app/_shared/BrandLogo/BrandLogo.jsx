import Image from 'next/image';
import './BrandLogo.css';

export default function BrandLogo({className='',darkSurface=false,priority=false}){
  return <span className={`brand-logo ${darkSurface?'on-dark':''} ${className}`.trim()}>
    <Image className="brand-logo-light" src="/assets/teklms-logo.svg" alt="TekLMS" width={240} height={62} priority={priority}/>
    <Image className="brand-logo-dark" src="/assets/teklms-logo-dark.svg" alt="TekLMS" width={240} height={62} priority={priority}/>
  </span>
}
