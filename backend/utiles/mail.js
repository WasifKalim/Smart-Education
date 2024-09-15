const nodemailer=require('nodemailer');
require('dotenv').config();

exports.sendMail=async (receiverMail,title,body)=>{ 
   try {
    const transporter={
        host:process.env.GMAIL_HOST,
        port:process.env.GMAIL_PORT,
        secure:false,
        auth:{
            user:process.env.HOST_USER_EMAIL,
            pass:process.env.HOST_USER_PASSWORD
        }
    }
    
    let mail_Transport=nodemailer.createTransport(transporter);
    
    let mailOptions={
        from:`Smart Education  ${process.env.GMAIL_HOST}`,
        to:`${receiverMail}`,
        subject:title,
        text:body
    }
    let info=mail_Transport.sendMail(mailOptions);
    console.log(info);

    return info;
   } catch (error) {
      console.log(`Error in sending mail ${error}`);
      throw error;
   }
}