"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/users.types";
import { useRouter } from "next/navigation";
// import { useDeleteUser } from "@/queries/users.queries";
import { ActionIcon } from "@/assets/icons/customer/action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CustomerTableColumns = (
  handleBlockOpen: (user: User) => void,
): ColumnDef<User>[] => {
  const router = useRouter();
  // const { mutate: deleteUser } = useDeleteUser();
  const onEditProduct = (id: number) => {
    router.push(`/customers/${id}`);
  };

  // const onDeleteProduct = (id: number) => {
  //   deleteUser(id.toString());
  // };

  return [
    {
      accessorKey: "id",
      size: 80,
      header: () => <h3 className="pl-2">ID</h3>,
      cell: ({ row }) => (
        <div className="font-medium pl-2">
          #{Number(row.getValue("id")).toString().padStart(4, "0")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      size: 180,
      header: () => <h3>Name</h3>,
      cell: ({ row }) => (
        <div className="font-medium flex gap-2.5 items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${row.getValue("picture")}`}
              alt="user"
            />
            <AvatarFallback>{(row.getValue("name") as string)?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      size: 150,
      header: () => <h3>Phone Number</h3>,
      cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "email",
      size: 220,
      header: () => <h3>Email</h3>,
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "totalOrder",
      size: 120,
      header: () => <h3 className="whitespace-nowrap">Total orders</h3>,
      cell: ({ row }) => <div>{row.getValue("totalOrder") || 0}</div>,
    },
    {
      accessorKey: "deleted",
      size: 120,
      header: () => <h3 className="text-center">Status</h3>,
      cell: ({ getValue }) => {
        const status = getValue() as string;

        const color = status
          ? "bg-yellow-100 text-yellow-800"
          : "bg-green-100 text-green-800";

        return (
          <p className="text-center">
            <span
              className={`inline-block w-24 rounded-full px-3 py-1 text-center text-sm font-normal ${color}`}
            >
              {status ? "Inactive" : "Active"}
            </span>
          </p>
        );
      },
    },
    {
      id: "actions",
      size: 100,
      header: () => <h3 className="text-center">Action</h3>,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="flex cursor-pointer items-center justify-center rounded-full"
              onClick={() => onEditProduct(user.id)}
            >
              <ActionIcon />
            </Button>
          </div>
        );
      },
    },
  ];
};