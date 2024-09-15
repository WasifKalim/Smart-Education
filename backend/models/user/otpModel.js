const mongoose = require("mongoose");
const mailSender = require("../../utiles/mail");


const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
    },
    otp:{
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }
});

// Mail Send
async function sendVerificationEmail(email, otp){
    // Send mail
    try{
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            emailTemplate(otp)
        );
        console.log("Email Send Successfully: ", mailResponse);
    }
    catch(error){
        console.log("Error occured while sending email: ", error);
        throw error;
    }
}


// Define a post-save hook to send email after the document has been saved
otpSchema.pre("save", async function(next){
    console.log("New document saved to database");
    // this.isNew -> checks the email & otp is New
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})

module.exports = mongoose.model("OTP", otpSchema)