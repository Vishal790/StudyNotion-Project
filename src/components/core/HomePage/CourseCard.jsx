import React from 'react'

import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";


const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
  return (
    <div
    className={`w-[360px] lg:w-[30%]  bg-white  text-richblack-200 h-[300px] box-border cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all hover:shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] hover:scale-125 duration-200`}
    onClick={() => setCurrentCard(cardData?.heading)}
    >
      
      <div className='border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3 '>
        <div
        className={` ${
          currentCard === cardData?.heading && "text-richblack-800"
        } font-semibold text-[20px]`}
        >
          {cardData?.heading}
        </div>

        <div className="text-richblack-400">
          {cardData?.description}
        </div>

      </div>

      <div
       className={`flex justify-between ${
        currentCard === cardData?.heading ? "text-blue-300" : "text-richblack-300"
      } px-6 py-3 font-medium`}>

        <div  className="flex items-center gap-2 text-[16px]">
        <HiUsers />
        <p>{cardData?.level}</p>
          </div>

        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessonNumber} Lesson</p>
        </div>

      </div>
        
    </div>
  )
}

export default CourseCard