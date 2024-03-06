const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")



//reset password token

exports.resetPasswordToken = async (req, res) => {
    try {
        //get email
        const { email } = req.body;

        //check user for the email, email validation
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.json({
                success: false,
                message: "Your email is not registered with us"
            })
        }

        //generate token

        const token = crypto.randomUUID()

        //update user by addming tiken and expiration time

        const updatedDetails = await User.findOneAndUpdate({ email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            }, { new: true })


        //create url 
        const url = `http://localhost:3000/update-password/${token}`

        //send mail containing the url
        await mailSender(email, "Password reset link", `Password Reset link: ${url}`)


        return res.json({ success: true, message: "Email sent successfully check email and change password" })



    }

    catch (err) {
        return res.json({ success: false, message: err.message })

    }

}


// reset password

exports.resetPassword = async (req, res) => {
    try {
        //fetch data
        const { password, confirmPassword, token } = req.body

        //validation
        if (password !== confirmPassword) {
            return res.json({ success: false, message: 'Passwords do not match' })
        }

        //get user details from token
        const userDetails = await User.findOne({ token: token });

        //check for token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid"
            })
        }

        if (userDetails.resetPasswordExpires < Date.now()){
            return res.json({ success: false, message:"Token is expired, pleaase re-generate your token" })
        }

        //hash new password
        const hashedPassword = await bcrypt.hash(password,10)

        //update password for user
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}   
            )


        //return response

        return res.status(200).json({
            success:true,
            message:"Password reset successful"
        })

    }
    
    catch (err) {
        return res.json({ success: false, message: err.message })
    }
}