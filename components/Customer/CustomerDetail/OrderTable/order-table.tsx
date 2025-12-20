import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, StatusType } from "./status-badge";
import OrderAction from "./order-action";

export interface Order {
  id: string;
  created: string;
  total: string;
  products: string;
  status: StatusType;
}

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="rounded-[20px] bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#EEEEEE] text-lg">
            <TableHead className="px-5 py-2.5 text-gray-700 rounded-tl-[20px]">Order ID</TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">Created</TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">Total</TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">Purchased product</TableHead>
            <TableHead className="px-5 py-2.5 text-gray-700">Status</TableHead>
            <TableHead className="w-12 rounded-tr-[20px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={`${order.id}-${index}`}
              className="text-lg font-normal cursor-pointer"
            >
              <TableCell className="px-5 py-2.5 text-gray-600">
                {order.id}
              </TableCell>
              <TableCell className="px-5 py-2.5 text-gray-600">
                {order.created}
              </TableCell>
              <TableCell className="px-5 py-2.5 text-gray-600">
                {order.total}
              </TableCell>
              <TableCell className="px-5 py-2.5 text-gray-600">
                {order.products}
                <br />
                <span className="text-[#616FF5]">+5 more</span>
              </TableCell>
              <TableCell className="px-5 py-2.5">
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="px-5 py-2.5">
                <OrderAction />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
