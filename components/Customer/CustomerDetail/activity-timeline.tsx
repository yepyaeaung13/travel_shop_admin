"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ActivityItem {
  id: string
  type: "wishlist" | "order" | "review" | "login"
  description: string
  timestamp: string
  customerName: string
  productName?: string
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "wishlist":
        return "♡"
      case "order":
        return "📦"
      case "review":
        return "⭐"
      case "login":
        return "👤"
      default:
        return "•"
    }
  }

  const formatActivityDescription = (activity: ActivityItem) => {
    return activity.description
      .replace("{customerName}", `"${activity.customerName}"`)
      .replace("{productName}", activity.productName ? `"${activity.productName}"` : "")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg">
              {/* Activity Icon */}
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarFallback className="bg-gray-600 text-white text-xs">
                  {getActivityIcon(activity.type)}
                </AvatarFallback>
              </Avatar>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700">{formatActivityDescription(activity)}</div>
                <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
