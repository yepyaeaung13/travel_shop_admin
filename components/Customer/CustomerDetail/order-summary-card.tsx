"use client"

import { Card, CardContent } from "@/components/ui/card"

interface Order {
  id: string
  date: string
}

interface OrderSummaryCardProps {
  totalOrders: number
  totalSpend: string
  orders: Order[]
}

export default function OrderSummaryCard({ totalOrders, totalSpend, orders }: OrderSummaryCardProps) {
  return (
    <Card className="bg-gray-100">
      <CardContent className="p-4">
        {/* Summary Stats */}
        <div className="space-y-2 mb-4">
          <div className="text-sm">
            <span className="font-medium">Total order</span> - {totalOrders}
          </div>
          <div className="text-sm">
            <span className="font-medium">Total spend</span> - {totalSpend}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center text-sm">
              <span>Order ID</span>
              <span>Date</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
