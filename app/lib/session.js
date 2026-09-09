import crypto from 'node:crypto';
const secret=process.env.TEKLMS_SESSION_SECRET||'teklms-v6-session-secret-change-in-production-2026';
const enc=value=>Buffer.from(value).toString('base64url');
const sign=value=>crypto.createHmac('sha256',secret).update(value).digest('base64url');
export function createSignedToken(data,ttlMs=12*60*60*1000){const payload=enc(JSON.stringify({...data,iat:Date.now(),exp:Date.now()+ttlMs}));return `${payload}.${sign(payload)}`}
export function verifySignedToken(token=''){try{const[payload,sig]=String(token).split('.');if(!payload||!sig)return null;const expected=sign(payload);if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;const data=JSON.parse(Buffer.from(payload,'base64url').toString());if(!data.exp||Date.now()>data.exp)return null;return data}catch{return null}}
export function createSessionToken({role,username,studentId,name}){return createSignedToken({type:'session',role,username,studentId:studentId||null,name:name||null},12*60*60*1000)}
export function verifySessionToken(token=''){const data=verifySignedToken(token);if(!data||data.type!=='session'||!['admin','student'].includes(data.role))return null;return data}
