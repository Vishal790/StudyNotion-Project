import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center text-2xl text-white mt-36  ">
     <img
        src="https://cdn1.iconfinder.com/data/icons/photo-stickers-words/128/word_18-1024.png"
        alt="Not Found"
        className=" h-[400px]"
      />
      <p>
        <Link to="/">Go to Home </Link>
        
      </p>
     
    </div>
  );
};

export default Error;
