const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")

require("dotenv").config();



//send OTP

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        //check if usere already exists
        const checkUserPresent = await User.findOne({ email })
        //is user already present
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        }

        //generate otp

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("OTP generated ", otp);

        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp }

        //create entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response

        res.status(200).json({
            success: true,
            message: "Otp generated successfully"
        })


    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        })

    }
}


//Sign up

exports.signup = async (req, res) => {

    try {
        //data fetch from request body

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body;

        console.log(firstName, lastName, email, password, confirmPassword,
            accountType,otp);

        //validate data

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }


        //match 2 password fields

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            })

        }

        //check user already registered or not

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //find recent otp 

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("Recent OTP: ", recentOtp[0].otp);


        //validate otp

        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "OTP does not match"
            })
        }

        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10)

        //save to DB

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return res
        return res.status(200).json({
            success: true,
            message: `Successfully created user`,
            user
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `User cannot be created Please try again later`+err.message,
            
        })
    }

}

//Login

exports.login = async(req, res) => {

    try{
        //get the data
        const {email, password} = req.body;
        
        //validation
        if(!email || !password){
           return res.status(403).json({
                success: false,
                message: "All fields are required "
            })
        }


        //user exists?
''
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signUp and try again"
            })

        }

        //generate JWT token after matching password

        if(await bcrypt.compare(password,user.password)){

            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"4h",
            })
            user.token = token,
            user.password = undefined;

            //create cookie 
            const options ={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            res.cookie("token", token,options).status(200).json({ 
                success: true,
                token,
                user,
                message:"Logged in successfully"

            })


        }
        else{
            return res.status(401).json({
                success: false,
                message:"Password is incorrect"
            })
        }

    }
    catch (err) {

        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login failed"
        })

    }

}



// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }