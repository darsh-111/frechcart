import React, { lazy, Suspense } from 'react'
import FeaturedProductsPage from './_componant/FeaturedProducts/FeaturedProducts'
import MySwiper from './_componant/Swiper/Swiper'
import img1 from'../assets/images/images.png'
import img3 from'../assets/images/images1.png'
import img2 from '../assets/images/download (1).png'

//import HomeCategories from './_componant/HomeCategories/HomeCategories'
const HomeCategorieslazy= lazy(() => import("./_componant/HomeCategories/HomeCategories"))
export default function home() {
  return (
    <>
      <div className='w-full'>

      <MySwiper myslider={ [img3.src,img1.src,img2.src]} />
      </div>
      <Suspense fallback={<div className="flex justify-center items-center py-20 w-full">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#198754] rounded-full animate-spin"></div>
      </div>}>

      <HomeCategorieslazy/>
      </Suspense>
      <FeaturedProductsPage/>
    </>
  )
}
