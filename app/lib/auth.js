export function saveAuth(account){if(typeof window!=='undefined')localStorage.setItem('teklms-auth',JSON.stringify({role:account.role,username:account.username,studentId:account.studentId||null,name:account.name||null,loggedIn:true,at:Date.now()}))}
export function getAuth(){if(typeof window==='undefined')return null;try{return JSON.parse(localStorage.getItem('teklms-auth')||'null')}catch{return null}}
export function clearAuth(){if(typeof window!=='undefined')localStorage.removeItem('teklms-auth')}
