"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/users.types";
import { useRouter } from "next/navigation";
// import { useDeleteUser } from "@/queries/users.queries";
import { ActionIcon } from "@/assets/icons/customer/action";

export const CustomerTableColumns = (
  handleBlockOpen: (user: User) => void
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
      id: "select",
      header: ({ table }) => (
        <div className="pl-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="text-[#303030]"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="pl-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="text-[#303030]"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => <h3>ID</h3>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <h3>Name</h3>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: () => <h3>Phone Number</h3>,
      cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <h3>Email</h3>,
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "totalOrderCount",
      header: () => <h3>Total orders</h3>,
      cell: ({ row }) => <div>{row.getValue("totalOrderCount") || 0}</div>,
    },
    {
      accessorKey: "status",
      header: () => <h3 className="text-center">Status</h3>,
      cell: ({ getValue }) => {
        const status = getValue() as string;

        const color =
          {
            ACTIVE: "bg-green-100 text-green-800",
            INACTIVE: "bg-yellow-100 text-yellow-800",
            SUSPENDED: "bg-red-100 text-red-800",
          }[status] ?? "bg-gray-100 text-gray-800";

        return (
          <p className="text-center">
            <span
              className={`inline-block w-24 rounded-full px-3 py-1 text-center text-sm font-normal ${color}`}
            >
              {status == "ACTIVE" ? "Active" : "Blocked"}
            </span>
          </p>
        );
      },
    },
    {
      id: "actions",
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
            {/* <Button
              variant="ghost"
              size="icon"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F6F1F4] transition-all duration-300 hover:scale-105 hover:bg-[#EEEEEE]"
              onClick={() => handleBlockOpen(user)}
            >
              <BanIcon className="h-4 w-4 rotate-90 text-[#FF3333]" />
            </Button> */}
          </div>
        );
      },
    },
  ];
};

// const SortableHeaderV1 = ({
//   title,
//   sortName,
//   sortOptions,
//   handleSortChange,
// }: {
//   title: string;
//   sortName: string;
//   handleSortChange: (value: UserSortOption) => void;
//   sortOptions: {
//     label: string;
//     value: UserSortOption;
//   }[];
// }) => {
//   const options = sortOptions.filter((sort) =>
//     sort.label.toLowerCase().includes(sortName),
//   );
//   const [show, setShow] = useState<boolean>(false);
//   const sortChange = (option: { label: string; value: UserSortOption }) => {
//     handleSortChange(option.value);
//     setShow(false);
//   };
//   return (
//     <div className="relative">
//       <Button
//         variant="ghost"
//         onClick={() => setShow(!show)}
//         className="h-auto cursor-pointer p-0 font-medium"
//       >
//         {title}
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//       {show && (
//         <div className="absolute top-5 flex translate-x-1/2 flex-col rounded-[10px] bg-gray-200 shadow">
//           {options.map((option, index) => (
//             <p
//               className={cn(
//                 "cursor-pointer p-2",
//                 (index + 1) % 2 !== 0 && "border-b border-amber-50",
//               )}
//               key={index}
//               onClick={() => sortChange(option)}
//             >
//               {option.label}
//             </p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
