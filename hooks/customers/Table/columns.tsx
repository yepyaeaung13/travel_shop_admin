"use client";
import { z } from "zod/v4";
import { createColumnHelper } from "@tanstack/react-table";
import { DeleteIcon, EditIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const customerColumnsSchema = z.array(
  z.object({
    id: z.number(),
    customerName: z.string(),
    phoneNo: z.string(),
    email: z.email(),
    totalOrder: z.number(),
    totalSpend: z.number(),
    status: z.string(),
    avatar: z.url(),
    birthdate: z.date(),
    registeredAt: z.date(),
  }),
);
const columnHelper =
  createColumnHelper<z.infer<typeof customerColumnsSchema>>();
export const customerColumns = [
  columnHelper.display({
    id: "id_select",
    header: () => {
      return <Checkbox />;
    },
    cell: ({ row }) => {
      return <Checkbox name={row.id} id={row.id} />;
    },
  }),
  columnHelper.accessor("id", {
    header: "Order ID",
  }),
  columnHelper.accessor("customerName", {
    header: "Name",
  }),
  columnHelper.accessor("phoneNo", {
    header: "Phone",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("totalOrder", {
    header: "Total Orders",
  }),
  columnHelper.accessor("totalSpend", {
    header: "Total Spend",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            className="rounded-full"
            size="icon"
            onClick={() => {
              window.location.href = `/orders/${row.id}`;
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="rounded-full"
            size="icon"
            onClick={() => {}}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="rounded-full"
            size="icon"
            onClick={() => {}}
          >
            <DeleteIcon className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }),
];
