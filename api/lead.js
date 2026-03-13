
export default async function handler(req,res){

  const webhook = process.env.LEAD_WEBHOOK_URL;

  if(webhook){
    await fetch(webhook,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(req.body)
    });
  }

  res.send("Thank you! A local expert will contact you shortly.");
}
