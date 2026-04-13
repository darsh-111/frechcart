"use client";
import React from "react";
import { PropagateLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="h-[40vh] w-full flex flex-col justify-center items-center">
            {/* الـ Spinner نفسه */}
            <PropagateLoader
                color="#198754" // اللون الأخضر بتاعك
                size={15}       // حجم الكور
                speedMultiplier={0.8} // سرعة الحركة
            />

            
            
        </div>
    );
}