'use client'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles

import 'swiper/swiper-bundle.css';
import { Navigation, Pagination} from 'swiper/modules';

export default function MySwiper({spaceBetween =0, slidesPerView=1, myslider}:{ spaceBetween?: number, slidesPerView?: number, myslider: string[] } ) {
    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            navigation
            pagination={{
                clickable: true, renderBullet(index, className) {
                    
                    return `<span class=" ${className} bg-danger! w-7! h-7! bg-white!"></span>`;   
                },
//bulletActiveClass:"w-10! h-10! bg-danger!"
            }}

        >
            {myslider.map((slider) => (
                <SwiperSlide><img className='w-full h-110' src={slider} alt={slider} /></SwiperSlide>
               
           ))}
        </Swiper>
    );
};