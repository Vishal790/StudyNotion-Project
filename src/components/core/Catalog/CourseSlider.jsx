import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper/modules'


import Course_Card from "./Course_Card";

const CourseSlider = ({ Courses }) => {
  return (
    <div>
      {Courses?.length ? (
        <Swiper

        loop= {true}
        slidesPerView= {1} 
        spaceBetween={25}
        modules={[FreeMode, Pagination,Autoplay]}
        autoplay={{
            delay: 2500,
            disableOnInteraction: false
        }}
        pagination={{
            type: 'progressbar'
        }}
       
        navigation={true}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem] my-swiper"

        >
       
          {Courses?.map((course, index) => (
            <SwiperSlide key={index}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No Courses Found</p>
      )}
    </div>
  );
};

export default CourseSlider;
