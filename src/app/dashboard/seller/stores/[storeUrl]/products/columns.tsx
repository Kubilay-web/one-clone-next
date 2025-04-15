"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Custom components
import CategoryDetails from "@/components/dashboard/forms/category-details";
import CustomModal from "@/components/dashboard/shared/custom-modal";

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import {
  BadgeCheck,
  BadgeMinus,
  CopyPlus,
  Edit,
  FilePenLine,
  MoreHorizontal,
  Trash,
} from "lucide-react";

// Queries
import { deleteProduct } from "@/queries/product";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";
import { StoreProductType } from "@/lib/types";
import Link from "next/link";

export const columns: ColumnDef<StoreProductType>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-3">
          <h1 className="truncate border-b pb-3 font-bold capitalize">
            {row.original.name}
          </h1>
          <div className="relative flex flex-wrap gap-2">
            {row.original.variants.map((variant) => (
              <div className="group flex flex-col gap-y-2" key={variant.id}>
                <div className="relative cursor-pointer">
                  <Image
                    src={variant.images[0].url}
                    alt={`${variant.variantName} image`}
                    width={1000}
                    height={1000}
                    className="h-80 min-w-72 max-w-72 rounded-sm object-cover shadow-2xl"
                  />
                  <Link
                    href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/${variant.id}`}
                  >
                    <div className="absolute bottom-0 left-0 right-0 top-0 z-0 hidden h-full w-full rounded-sm bg-black/50 transition-all duration-150 group-hover:block">
                      <FilePenLine className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                  </Link>
                </div>
                <div className="mt-2 flex gap-2 p-1">
                  <div className="flex w-7 flex-col gap-2 rounded-md">
                    {variant.colors.map((color) => (
                      <span
                        key={color.name}
                        className="h-5 w-5 rounded-full shadow-2xl"
                        style={{ backgroundColor: color.name }}
                      />
                    ))}
                  </div>
                  <div>
                    <h1 className="max-w-40 text-sm capitalize">
                      {variant.variantName}
                    </h1>
                    <div className="mt-1 flex max-w-72 flex-wrap gap-2">
                      {variant.sizes.map((size) => (
                        <span
                          key={size.size}
                          className="w-fit rounded-md border-2 bg-white/10 p-1 text-[11px] font-medium"
                        >
                          {size.size} - ({size.quantity}) - {size.price}$
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <span>{row.original.category.name}</span>;
    },
  },

  {
    accessorKey: "subCategory",
    header: "SubCategory",
    cell: ({ row }) => {
      return <span>{row.original.subCategory.name}</span>;
    },
  },

  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return <span>{row.original.brand}</span>;
    },
  },

  {
    accessorKey: "new-variant",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/new`}
        >
          <CopyPlus className="hover:text-blue-200" />
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions productId={rowData.id} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  productId: string;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ productId }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Return null if rowData or rowData.id don't exist
  if (!productId) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete product
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            product and variants that exist inside product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="mb-2 bg-destructive text-white hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              await deleteProduct(productId);
              toast({
                title: "Deleted product",
                description: "The product has been deleted.",
              });
              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
