import { CartProductType } from "@/lib/types";
import { Size } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, FC, SetStateAction, useEffect } from "react";

interface Props {
  sizes: Size[] | undefined;
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: any) => void;
  setSizeId: Dispatch<SetStateAction<string>>;
}

const SizeSelector: FC<Props> = ({
  sizeId,
  setSizeId,
  sizes,
  handleChange,
}) => {
  const pathname = usePathname();
  const { replace, refresh } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleSelectSize = (size: Size) => {
    params.set("size", size.id);
    replace(`${pathname}?${params.toString()}`);
  };

  if (!sizes || sizes.length === 0) {
    return null; // ya da sadece `return null;`
  }

  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size) => (
        <span
          key={size.id}
          className={`cursor-pointer rounded-full border px-5 py-1 transition-all hover:bg-orange-background hover:text-white ${
            size.id === sizeId ? "bg-orange-background text-white" : ""
          }`}
          onClick={() => handleSelectSize(size)}
        >
          {size.size}
        </span>
      ))}
    </div>
  );
};

export default SizeSelector;
