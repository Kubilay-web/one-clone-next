"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Custom components
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  Expand,
  MoreHorizontal,
  Trash,
} from "lucide-react";

// Queries
import { deleteStore } from "@/queries/store";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// Prisma models
import { AdminStoreType, StoreStatus } from "@/lib/types";
import StoreStatusSelect from "@/components/dashboard/forms/store-status-select";
import StoreSummary from "@/components/dashboard/shared/store-summary";

export const columns: ColumnDef<AdminStoreType>[] = [
  {
    accessorKey: "cover",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="relative h-44 min-w-64 overflow-hidden rounded-xl">
          <Image
            src={row.original.cover}
            alt=""
            width={500}
            height={300}
            className="h-40 w-96 rounded-md object-cover shadow-sm"
          />
          <Image
            src={row.original.logo}
            alt=""
            width={200}
            height={200}
            className="absolute left-4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full object-cover shadow-2xl"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span className="text-lg font-extrabold capitalize">
          {row.original.name}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span className="line-clamp-3 text-sm">{row.original.description}</span>
      );
    },
  },

  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      return <span>/{row.original.url}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <StoreStatusSelect
          storeId={row.original.id}
          status={row.original.status as StoreStatus}
        />
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      return (
        <span className="flex justify-center text-muted-foreground">
          {row.original.featured ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "open",
    header: "",
    cell: ({ row }) => {
      return <OpenButton store={row.original} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions storeId={rowData.id} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  storeId: string;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ storeId }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Return null if rowData or rowData.id don't exist
  if (!storeId) return null;

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
              <Trash size={15} /> Delete store
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
            This action cannot be undone. This will permanently delete the store
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="mb-2 bg-destructive text-white hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              await deleteStore(storeId);
              toast({
                title: "Deleted store",
                description: "The store has been deleted.",
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
const OpenButton: React.FC<{ store: AdminStoreType }> = ({ store }) => {
  const { setOpen } = useModal();

  return (
    <button
      className="group relative isolation-auto z-10 mx-auto flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 bg-[#0A0D2D] px-4 py-2 font-sans text-lg text-gray-50 backdrop-blur-md before:absolute before:-left-full before:-z-10 before:aspect-square before:w-full before:rounded-full before:bg-blue-primary before:transition-all before:duration-700 hover:text-gray-50 before:hover:left-0 before:hover:w-full before:hover:scale-150 before:hover:duration-700 lg:font-semibold"
      onClick={() => {
        setOpen(
          <CustomModal maxWidth="!max-w-3xl">
            <StoreSummary store={store} />
          </CustomModal>,
        );
      }}
    >
      View
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
        <Expand className="w-5 stroke-black" />
      </span>
    </button>
  );
};
