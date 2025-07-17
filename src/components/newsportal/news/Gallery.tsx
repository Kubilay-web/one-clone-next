import Image from "next/image";
import React from "react";

const Gallery = () => {
  return (
    <div className="flex w-full flex-col gap-y-[14px]">
      <div className="relative pl-3 text-xl font-bold text-white before:absolute before:-left-0 before:h-full before:w-[4px] before:bg-[#5271ff]">
        Gallery
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((item, i) => (
          <div key={i} className="relative h-[85px] w-full">
            <Image
              className=""
              layout="fill"
              src={
                "https://res.cloudinary.com/dbxtifnah/image/upload/v1727024773/news_images/exyvlbygul69g61urbyn.png"
              }
              alt="gallery image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
