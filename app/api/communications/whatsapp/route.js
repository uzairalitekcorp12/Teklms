import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySessionToken} from '@/app/lib/session';

const normalizePhone=value=>String(value||'').replace(/\D/g,'');

export async function POST(request){
  const jar=await cookies();
  const session=verifySessionToken(jar.get('teklms_session')?.value);
  if(!session||session.role!=='admin')return NextResponse.json({ok:false,message:'Administrator access is required.'},{status:401});

  try{
    const body=await request.json();
    const message=String(body.message||'').trim().slice(0,3800);
    const recipients=(Array.isArray(body.recipients)?body.recipients:[])
      .map(recipient=>({name:String(recipient?.name||'Student').slice(0,120),phone:normalizePhone(recipient?.phone)}))
      .filter(recipient=>recipient.phone.length>=8)
      .slice(0,120);
    if(!message||!recipients.length)return NextResponse.json({ok:false,message:'Write a message and select at least one student with a valid phone number.'},{status:400});

    const accessToken=process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId=process.env.WHATSAPP_PHONE_NUMBER_ID;
    const graphVersion=process.env.WHATSAPP_GRAPH_API_VERSION||'v23.0';
    const sender=normalizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'923001234567');
    if(!accessToken||!phoneNumberId){
      return NextResponse.json({ok:false,configured:false,message:'Automatic WhatsApp delivery needs WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID from Meta Business.'},{status:503});
    }

    const templateName=process.env.WHATSAPP_TEMPLATE_NAME||'';
    const templateLanguage=process.env.WHATSAPP_TEMPLATE_LANGUAGE||'en_US';
    const endpoint=`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;
    const makePayload=recipient=>templateName?{
      messaging_product:'whatsapp',recipient_type:'individual',to:recipient.phone,type:'template',
      template:{name:templateName,language:{code:templateLanguage},components:[{type:'body',parameters:[{type:'text',text:message}]}]}
    }:{
      messaging_product:'whatsapp',recipient_type:'individual',to:recipient.phone,type:'text',
      text:{preview_url:true,body:message}
    };

    const results=await Promise.allSettled(recipients.map(recipient=>fetch(endpoint,{
      method:'POST',
      headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},
      body:JSON.stringify(makePayload(recipient))
    }).then(async response=>({ok:response.ok,status:response.status,body:await response.text()}))));
    const sent=results.filter(result=>result.status==='fulfilled'&&result.value.ok).length;
    const failed=recipients.length-sent;
    return NextResponse.json({ok:sent>0,configured:true,sender,sent,failed,audienceCount:recipients.length,status:sent?(failed?'Partially accepted':'Accepted by provider'):'Failed',message:sent?'WhatsApp message accepted for delivery.':'WhatsApp rejected the message. Check the token, registered sender, recipient and approved template.'},{status:sent?200:502,headers:{'Cache-Control':'no-store'}});
  }catch{
    return NextResponse.json({ok:false,message:'WhatsApp delivery could not be completed.'},{status:400});
  }
}
