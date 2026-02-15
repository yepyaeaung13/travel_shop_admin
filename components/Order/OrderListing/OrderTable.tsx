import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatus } from "../OrderDetail/payment-info";
import { OrderStatus } from "../OrderDetail/order-info";
import { useRouter } from "next/navigation";

export const getPaymentStatusColor = (stauts: PaymentStatus) => {
  switch (stauts) {
    case PaymentStatus.APPROVED:
      return "bg-[#E4FFDF] text-[#126D00]";
    case PaymentStatus.REJECTED:
      return "bg-[#FFDBDB] text-[#FF3333]";
    case PaymentStatus.PENDING:
      return "bg-[#FFFAA3] text-[#827C00]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getOrderStatusColor = (stauts: OrderStatus) => {
  switch (stauts) {
    case OrderStatus.Pending:
      return "bg-[#FFFAA3] text-[#827C00]";
    case OrderStatus.Confirmed:
      return "bg-[#CDE7FF] text-[#2A6EAA]";
    case OrderStatus.Preparing:
      return "bg-[#FFE2B8] text-[#B96A1E]";
    case OrderStatus.Shipped:
      return "bg-[#E1D7FF] text-[#5A3FA8]";
    case OrderStatus.Delivered:
      return "bg-[#E4FFDF] text-[#126D00]";
    case OrderStatus.Fulfilled:
      return "bg-[#616FF5] text-[#FFFFFF]";
    case OrderStatus.Rejected:
      return "bg-[#FFDBDB] text-[#FF3333]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

type OrderTableProps = {
  orders: any[];
};

export default function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();

  return (
    <Table className="table-fixed md:table-auto">
      <TableHeader className="bg-[#4444441A]">
        <TableRow className="md:text-lg h-14">
          <TableHead className="text-[#303030] w-10 pl-5 md:w-16 md:pl-6">
            <p>ID</p>
          </TableHead>
          <TableHead
            className={cn("w-[150px] text-[#303030] cursor-pointer md:w-72 2xl:w-96")}
          >
            Customer name
          </TableHead>
          <TableHead className="w-[100px] text-[#303030] text-center">Date</TableHead>
          <TableHead className="w-[150px] text-[#303030] text-center">Qty</TableHead>
          <TableHead className="w-[150px] text-[#303030] text-center">Total</TableHead>
          <TableHead className="w-[200px] text-[#303030] text-center">
            Payment method
          </TableHead>
          <TableHead className="w-[200px] text-[#303030] text-center">
            Payment status
          </TableHead>
          <TableHead className="w-[200px] text-[#303030] text-center">Order status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-0">
        {orders.length > 0 &&
          orders.map((order) => {
            return (
              <TableRow
                key={order.id}
                onClick={() => router.push(`/orders/${order.id}`)}
                className="border-none md:text-lg cursor-pointer text-[#303030]"
              >
                <TableCell className="pl-5 md:pl-6">
                  <p className="text-center">
                    #{order.id.toString().padStart(3, "0")}
                  </p>
                </TableCell>
                <TableCell className="py-4">
                  <div className="pl-2 md:pl-5">
                    <p className="text-wrap line-clamp-2 break-all md:text-lg">
                      {order.user.name}
                    </p>
                    <p className="text-wrap line-clamp-2 break-all text-[#929292] text-sm md:text-base">
                      {order.user.phoneNumber}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-center text-wrap w-[120px]">
                    {new Date(order.createdAt)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(",", " at")}
                  </p>
                </TableCell>
                <TableCell className="text-center">{order.qty}</TableCell>
                <TableCell className="text-center">
                  {Number(order.totalAmount).toLocaleString()} Ks
                </TableCell>
                <TableCell className="text-center">
                  {order.payment?.methodName || ""}
                </TableCell>
                <TableCell>
                  <p
                    className={cn(
                      "w-[110px] rounded-full py-1.5 text-center mx-auto",
                      getPaymentStatusColor(
                        order.payment?.status?.toLowerCase(),
                      ),
                    )}
                  >
                    {capitalizeWords(order.payment?.status || "failed")}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  <p
                    className={cn(
                      "w-[110px] rounded-full py-1.5 text-center mx-auto",
                      getOrderStatusColor(order.status),
                    )}
                  >
                    {capitalizeWords(order.status || "")}
                  </p>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
