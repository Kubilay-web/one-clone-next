// React, Next.js
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

// Import of the image shown when there are no images available
import NoImageImg from "../../../../public/assets/images/no_image_2.png";

// Utils
import { cn, getDominantColors, getGridClassName } from "@/lib/utils";

//Icons
import { Trash } from "lucide-react";
import ColorPalette from "./color-palette";
// import ColorPalette from "./color-palette";

interface ImagesPreviewGridProps {
  images: { url: string }[]; // Array of image URLs
  onRemove: (value: string) => void; // Callback function when an image is removed
  colors?: { color: string }[]; // List of colors from form
  setColors: Dispatch<SetStateAction<{ color: string }[]>>; // Setter function for colors
}

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> = ({
  images,
  onRemove,
  colors,
  setColors,
}) => {
  // Calculate the number of images
  let imagesLength = images?.length;

  // Get the grid class name based on the number of images
  const GridClassName = getGridClassName(imagesLength);

  // Extract images colors
  const [colorPalettes, setColorPalettes] = useState<string[][]>([]);
  useEffect(() => {
    const fecthColors = async () => {
      const palettes = await Promise.all(
        images?.map(async (img) => {
          try {
            const colors = await getDominantColors(img.url);
            return colors;
          } catch (error) {
            return [];
          }
        }),
      );
      setColorPalettes(palettes);
    };

    if (imagesLength > 0) {
      fecthColors();
    }
  }, [images]);

  console.log("colorpaletess----->", colorPalettes);

  // If there are no images, display a placeholder image
  if (imagesLength === 0) {
    return (
      <div>
        <Image
          src={NoImageImg}
          alt="No images available"
          width={500}
          height={600}
          className="rounded-md"
        />
      </div>
    );
  } else {
    // If there are images, display the images in a grid
    return (
      <div className="max-w-4xl">
        <div
          className={cn(
            "grid h-[800px] overflow-hidden rounded-md bg-white",
            GridClassName,
          )}
        >
          {images?.map((img, i) => (
            <div
              key={i}
              className={cn(
                "group relative h-full w-full border border-gray-300",
                `grid_${imagesLength}_image_${i + 1}`,
                {
                  "h-[266.66px]": images.length === 6,
                },
              )}
            >
              {/* Image */}
              <Image
                src={img.url}
                alt=""
                width={800}
                height={800}
                className="h-full w-full object-cover object-top"
              />
              {/* Actions */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 top-0 hidden cursor-pointer flex-col items-center justify-center gap-y-3 bg-white/55 transition-all duration-500 group-hover:flex",
                  {
                    "!pb-[40%]": imagesLength === 1,
                  },
                )}
              >
                <ColorPalette
                  colors={colors}
                  setColors={setColors}
                  extractedColors={colorPalettes[i]}
                />
                <button
                  className="Btn"
                  type="button"
                  onClick={() => onRemove(img.url)}
                >
                  <div className="sign">
                    <Trash size={18} />
                  </div>
                  <div className="text">Delete</div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ImagesPreviewGrid;
