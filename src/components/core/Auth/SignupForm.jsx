
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { sendOtp, signUp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"

export default function SignupForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [accountType, setAccountType] = useState("Student");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const[showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { firstName, lastName, email, password, confirmPassword } = formData

   



    function changeHandler(event) {
        const { name, value } = event.target;
        setFormData((prevData) => (
            {
                ...prevData,
                [name]: value
            }
        ))
    }

   async function submitHandler(event) {
        event.preventDefault();
        if(password != confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        const signupData = {
            ...formData,
            accountType,
          }
      
          // Setting signup data to state
          // To be used after otp verification
          dispatch(setSignupData(signupData))
          // Send OTP to user for verification
        //   console.log("signupData", signupData);

        //   console.log("before dispatching sendotp");
         dispatch(sendOtp(formData.email, navigate))
        //   console.log('After dispatching sendOtp');

        //   console.log("signupData", signupData);


      
          // Reset
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          setAccountType("Student")
    }


    return (

        <div>
            <div className='flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max '>
                <button
                className={`${accountType==="Student"
                 ? 
                 "bg-richblack-900  text-richblack-5":
                 "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                 onClick={()=>setAccountType("Student")}>Student</button>

                <button
                 className={`${accountType==="Instructor"
                 ? 
                 "bg-richblack-900  text-richblack-5":
                 "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                
                onClick={()=>setAccountType("Instructor")}>Instructor</button>
            </div>



            <form onSubmit={submitHandler}>
                <div className='flex gap-x-4  mt-[10px] '>
                    <label htmlFor="firstName" className='w-full  mt-[10px]'>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]" >First Name <sup  className="text-pink-200">*</sup></p>
                        <input type="text" name="firstName"
                            required
                            onChange={changeHandler}
                            placeholder="Enter first name"
                            value={formData.firstName}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                            w-full p-[12px]"

                        />
                    </label>

                    <label htmlFor="lastName " className='w-full  mt-[10px] '>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Last Name <sup  className="text-pink-200">*</sup></p>
                        <input type="text" name="lastName"
                            required
                            onChange={changeHandler}
                            placeholder="Enter last name"
                            value={formData.lastName}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                            w-full p-[12px]"
                        />
                    </label>
                </div>

           <div className='w-full mt-[10px]'>
           <label htmlFor="email" className='w-full  mt-[10px]'>
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">E-mail <sup  className="text-pink-200">*</sup></p>
                    <input type="email" name="email"
                        required
                        onChange={changeHandler}

                        placeholder="Enter Email Address"
                        value={formData.email}
                        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                        w-full p-[12px]"
                    />
                </label>
           </div>
                <div className=' flex  gap-x-4  mt-[10px]'>
                    <label htmlFor="password" className='relative w-full  mt-[10px]'>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Password <sup  className="text-pink-200">*</sup></p>
                        <input type={showPassword ? ("text") : ("password")}
                            name="password"
                            required
                            onChange={changeHandler}
                            placeholder="Create Password"
                            value={formData.password}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                            w-full p-[12px]"
                        />
                        <span onClick={() => setShowPassword((prev) => !prev)}
                        className=" absolute right-3 top-[38px] cursor-pointer ">
                            {
                                showPassword ?
                                    (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) :
                                    (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                            }
                        </span>
                    </label>
                    <label htmlFor="confirmPassword " className=' relative w-full mt-[10px]'>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Confirm Password <sup  className="text-pink-200">*</sup></p>
                        <input type={showConfirmPassword ? ("text"):("password")}
                            name="confirmPassword"
                            required
                            onChange={changeHandler}
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                            w-full p-[12px]"
                        />

                        <span onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className=" absolute right-3 top-[38px] cursor-pointer ">
                            {
                                showConfirmPassword ?
                                    (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) :
                                    (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                            }
                        </span>

                    </label>
                </div>

                <button  className="w-full bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px]  mt-6" >Create account</button>
            </form>
        </div>



    )
}