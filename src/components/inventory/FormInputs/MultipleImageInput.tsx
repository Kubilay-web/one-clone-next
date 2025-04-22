"use client";

// import { UploadButton } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

type ImageInputProps = {
  title: string;
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
  endpoint: any;
  onRemove?: (index: number) => void;
};

export default function MultipleImageInput({
  title,
  imageUrls,
  setImageUrls,
  endpoint,
  onRemove,
}: ImageInputProps) {
  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index);
    } else {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {imageUrls.map((imageUrl: string, i: number) => (
              <div key={i} className="group relative">
                <Image
                  alt={`Product image ${i + 1}`}
                  className="aspect-square h-24 w-full rounded-md border object-contain"
                  height="96"
                  src={imageUrl || "/placeholder.svg"}
                  width="96"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* <UploadButton
          className="w-full"
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            setImageUrls([...imageUrls, ...res.map((item) => item.url)]);
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        /> */}
      </div>
    </div>
  );
}
