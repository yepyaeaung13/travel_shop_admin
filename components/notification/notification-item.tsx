import IconDeleteAccount from "@/assets/icons/notification/IconDeleteAccount";
import IconNewAccount from "@/assets/icons/notification/IconNewAccount";
import IconNewOrder from "@/assets/icons/notification/IconNewOrder";
import { NotiActionType } from "@/store/useNotiStore";
import React from "react";
import { formatNotificationDate } from "./navbar-notification";
import IconLowOfStock from "@/assets/icons/order/status/IconLowOfStock";
import IconOutOfStock from "@/assets/icons/order/status/IconOutOfStock";

const NotificationItem = ({
  type,
  title,
  description,
  time,
  isRead,
}: {
  type: NotiActionType
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}) => {
  const getIcon = () => {
    switch (type) {
      case NotiActionType.order_new:
        return <IconNewOrder />;
      case NotiActionType.account_created:
        return <IconNewAccount />;
      case NotiActionType.account_deleted:
        return <IconDeleteAccount />;
      case NotiActionType.low_of_stock:
        return <IconLowOfStock />;
      case NotiActionType.out_of_stock:
        return <IconOutOfStock />;

      default:
        return <div></div>;
    }
  };

  return (
    <div className="flex w-full items-start md:items-center justify-between gap-2.5 md:gap-4">
      <div className="flex md:h-[60px] md:w-[60px] h-[50px] w-[50px] items-center justify-center rounded-full bg-[#1A1A1A]/10">
        {getIcon()}
      </div>
      <div className="flex flex-1 flex-col items-start space-y-1">
        <span className="text-base font-medium text-[#000000] md:text-lg">
          {title}
        </span>
        <span className="text-sm font-normal text-[#3C3C3C]/80 md:text-base">
          {description}
        </span>
        <span className="text-xs font-normal text-[#616FF5] md:text-sm">
          {formatNotificationDate(time)}
        </span>
      </div>
      {!isRead && <div className="size-[10px] rounded-full bg-[#616FF5]" />}
    </div>
  );
};

export default NotificationItem;
