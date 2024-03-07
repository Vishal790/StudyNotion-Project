import React, { useEffect, useState } from 'react';
import CTAButton from "../HomePage/Button";
import HighlightText from "../HomePage/HighlightText";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({ position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor }) => {
  const [numVisibleLines, setNumVisibleLines] = useState(11); 
  useEffect(() => {
    // Calculate the number of visible lines based on the screen width
    const screenWidth = window.innerWidth;
    const numLines = screenWidth < 768 ? 16 : 11; // Adjust this value as needed
    setNumVisibleLines(numLines);
  }, []);

  return (
    <div className={`flex ${position} my-20 justify-between gap-10 w-[450px] md:w-auto`}>
      {backgroundGradient}
      {/* Section1 */}
      <div className=' w-[50%] flex-col gap-8  ml-2 '>
        {heading}
        <div className='text-richblack-300 font-bold'>
          {subheading}
        </div>
        <div className=' flex gap-7 mt-7 '>
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className='flex gap-2 items-center'>
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton> 
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn1.btnText}
          </CTAButton>
        </div>
      </div>
      {/* Section2 */}
      <div className='flex w-[100%] h-fit text-[12px] py-4 lg:w-[500px]'>
        <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold '>
          {[...Array(numVisibleLines)].map((_, index) => (
            <p key={index}>{index + 1}</p>
          ))}
        </div>
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
          <TypeAnimation
            sequence={[codeblock, numVisibleLines, ""]} // Render only numVisibleLines lines
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "inline",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
