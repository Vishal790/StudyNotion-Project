import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../../services/operations/authAPI";
import { useDispatch } from "react-redux";

export default function Loginform() {
    const navigate =useNavigate()
    const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;


  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function submitHandler(event) {
    event.preventDefault();
    dispatch(login(email, password, navigate));
  }

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col
       w-full g-y-4 mt-6"
    >
      <label htmlFor="email" className="w-full">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Email Address <sup className="text-pink-200">*</sup>
        </p>

        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter email address"
          onChange={changeHandler}
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
            w-full p-[12px]"
        />
      </label>

      <label htmlFor="password" className="w-full relative ">
        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
          Password <sup className="text-pink-200">*</sup>
        </p>

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={changeHandler}
          className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
            w-full p-[12px]"
        />

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className=" absolute right-3 top-[38px] cursor-pointer "
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>

        <Link to="/forgot-password">
          <p className="text-xs max-w-max text-blue-100 mt-1 ml-auto ">
            Forgot Password?
          </p>
        </Link>
      </label>

      <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px]  mt-6">
        Sign In
      </button>
    </form>
  );
}
