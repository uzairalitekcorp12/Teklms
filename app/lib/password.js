export async function hashPassword(value=''){
  const input=new TextEncoder().encode(String(value));
  const digest=await crypto.subtle.digest('SHA-256',input);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
