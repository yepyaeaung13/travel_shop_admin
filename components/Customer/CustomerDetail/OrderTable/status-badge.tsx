import { OrderStatus } from "@/components/Order/OrderDetail/order-info"
import { getOrderStatusColor } from "@/components/Order/OrderListing/OrderTable"
import { Badge } from "@/components/ui/badge"

// export type StatusType = "pending" | "completed" | "canceled"

interface StatusBadgeProps {
  status: OrderStatus
}

const statusConfig = {
   pending: {
    label: "Pending",
    className: "bg-[#FFFAA3] text-[#827C00]",
  },
   completed: {
    label: "Completed",
    className: "bg-[#E4FFDF] text-[#126D00]",
  },
  canceled: {
    label: "Canceled",
    className: "bg-[#FFDBDB] text-[#FF3333]",
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const className = getOrderStatusColor(status)

  return (
    <Badge variant="secondary" className={`${className} font-medium px-2.5 py-1`}>
      {status}
    </Badge>
  )
}
