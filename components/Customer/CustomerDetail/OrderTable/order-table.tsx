import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import OrderAction from "./order-action";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface OrderTableProps {
  orders: any[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();

  const handleOrderDetail = (orderId: number) => {
    router.push(`/orders/${orderId}`);
  };
  return (
    <div className="rounded-[20px] bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#EEEEEE] text-lg">
            <TableHead className="px-5 py-2.5 text-gray-700 rounded-tl-[20px]">
              Order ID
            </TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">Created</TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">Total</TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">
              Purchased product
            </TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">Status</TableHead>
            <TableHead className="w-12 rounded-tr-[20px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="text-lg font-normal cursor-pointer"
            >
              <TableCell className="px-5 py-2.5 text-gray-600">
                #{order.id.toString().padStart(3, "0")}
              </TableCell>
              <TableCell className="px-5 py-2.5 text-gray-600">
                {dayjs(order.createdAt).format("DD MMM YYYY [at] hh:mm A")}
              </TableCell>
              <TableCell className="px-5 py-2.5 text-gray-600">
                {Number(order.totalAmount).toLocaleString()} Ks
              </TableCell>
              <TableCell className="px-5 py-2.5 text-gray-600">
                {order.items[0]?.name}
                <br />
                {order.items.length > 1 && (
                  <span className="text-[#616FF5]">
                    +{order.items.length - 1} more
                  </span>
                )}
              </TableCell>
              <TableCell className="px-5 py-2.5">
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="px-5 py-2.5">
                <button onClick={() => handleOrderDetail(order.id)}>
                  <OrderAction />
                </button>
              </TableCell>
            </TableRow>
          ))}

          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-40">
                 <span className="font-medium text-[#444444]">
                  No order yet
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
