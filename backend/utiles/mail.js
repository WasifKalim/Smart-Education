const nodemailer=require('nodemailer');
require('dotenv').config();

exports.sendMail=(receiverMail,mailSubject,otp)=>{ 
    //console.log(process.env.HOST_USER_EMAIL ,process.env.HOST_USER_PASSWORD);
    
    if(mailSubject!=="" && otp){
        mailSubject='Smart-Education account OTP verification mail';
    }
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
        subject:`${mailSubject}`,
        text:`Your account verification otp is : ${otp}`
    }
    mail_Transport.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
            return 'Failed to send mail !'
        }
        return 'Mail successfully send .'
        
    })
}