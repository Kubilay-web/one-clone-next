"use client";
import Link from "next/link";
import MainSwiper from "../../shared/swiper";
import { SimpleProduct } from "@/lib/types";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Featured({ products }: { products: SimpleProduct[] }) {
  const is1170px = useMediaQuery({ query: "(min-width: 1170px)" });
  const is1700px = useMediaQuery({ query: "(min-width: 1700px)" });

  // State to store the current width of the screen
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    // Function to handle resize event and update screen width
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add the resize event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-md">
      <div
        className="flex w-full items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/images/ads/featured.webp)" }}
      >
        {/* Coupon */}
        <Link href="/">
          <div className="relative float-left h-[190px] w-52 px-3">
            <div className="flex h-[103px] flex-col items-center justify-center">
              <h3 className="my-1 w-full font-bold leading-5 text-white">
                Welcome Newcomers!
              </h3>
              <p className="w-full text-sm text-white">
                Enjoy shopping made easy like nothing before
              </p>
            </div>
            <div
              className="absolute bottom-[35px] h-[55px] w-[192px] overflow-hidden bg-contain bg-no-repeat pl-[14px] pr-[45px] text-left text-white"
              style={{ backgroundImage: "url(/assets/images/ads/coupon.gif)" }}
            >
              <h3 className="mb-1 mt-[11px] w-full text-[20px] leading-6 text-white">
                use &#39;666&#39;
              </h3>

              <p className="w-full -translate-y-1 overflow-hidden overflow-ellipsis text-xs">
                for 50% off
              </p>
            </div>
          </div>
        </Link>
        {/* Product swiper */}
        <div
          className={is1700px ? "ml-10" : ""}
          style={{
            width: !is1170px
              ? `${screenWidth - 300}px` // Less than 1170px
              : is1700px
                ? "750px" // More than 1700px
                : `calc(500px + 5vw)`, // Between 1170-1700px
          }}
        >
          {/*
            
            1170-1700===>
            */}
          <MainSwiper
            products={products}
            type="simple"
            slidesPerView={1}
            spaceBetween={-10}
          />
        </div>
      </div>
    </div>
  );
}
