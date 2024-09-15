const bcrypt = require("bcrypt")
const User = require("../../models/user/userModel")
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utiles/mail");
require("dotenv").config();

exports.userSignup = async(req, res) =>{
    try{
        const {name, email, password, accountType} = req.body;

        // Validate
        const user = await User.findOne({email});

        if(user){
            return res.status(200).json({
                success: false,
                message: "Email already registered"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        let userData = new User ({
            name,
            email,
            password: hashPassword,
            accountType,
        })


        // create otp
        //const otp = Math.floor(100000 + Math.random() * 900000);
        
        //sending verification mail
          //sendMail('rijusk700@gmail.com',"OTP verification","Your verification OTP is : ");
         
         
          let response = await userData.save();

        if(response){
            return res.status(200).json({
                success:true,
                data: response.data,
                message: "Account created Successfully"
            })
        }

        return res.status(400).json({
            success: false,
            message: "Failed to create account"
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            error:e,
            message: "Server Error"
        })
    }
}


exports.userLogin = async(req, res) => {
    try{
        const {email, password} = req.body;

        // Validate
        
        let user = await User.findOne({email});
        
        if(!user){
            return res.status(200).json({
                success: false,
                message: "Please SignUp"
            })
        }
        
        const passwordMatched = await bcrypt.compare(password, user.password);

        if(passwordMatched){
            const payload = {
                email: user.email,
                id: user._id,
                name: user.name
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h"} );

            const options = {
                expires: new Date(Date.now() + 3 * 24 *60 * 60)
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                user: user.name,
                token: token,
                message: "Login successful..."
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Password Does not Match"
            })
        }
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: e
        })
    }
}