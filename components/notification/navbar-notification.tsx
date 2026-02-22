import IconNewAccount from "@/assets/icons/notification/IconNewAccount";
import IconNewOrder from "@/assets/icons/notification/IconNewOrder";

const NavBarNotification = () => {
  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex w-full items-center justify-between">
        <p className="text-base font-medium text-black">Notifications</p>{" "}
      </div>

      <div className="flex flex-col space-y-4">
        <NotiItem
          type="order"
          title="New Order!"
          description="Jared Padalecki made a new order."
          time="1h ago"
          isRead={false}
        />
        <NotiItem
          type="account"
          title="Account created"
          description="Customer created account “Jensen”"
          time="1h ago"
          isRead={false}
        />
        <NotiItem
          type="order"
          title="New Order!"
          description="Jared Padalecki made a new order."
          time="1h ago"
          isRead={false}
        />
        <NotiItem
          type="account"
          title="Account created"
          description="Customer created account “Jensen”"
          time="1h ago"
          isRead={false}
        />
        <NotiItem
          type="order"
          title="New Order!"
          description="Jared Padalecki made a new order."
          time="1h ago"
          isRead={false}
        />
        <NotiItem
          type="account"
          title="Account created"
          description="Customer created account “Jensen”"
          time="1h ago"
          isRead={false}
        />
      </div>
    </div>
  );
};

const NotiItem = ({
  type,
  title,
  description,
  time,
  isRead,
}: {
  type: "order" | "account";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}) => {
  const getIcon = () => {
    switch (type) {
      case "order":
        return <IconNewOrder />;
      case "account":
        return <IconNewAccount />;
      default:
        return <div></div>;
    }
  };
  return (
    <div className="flex w-full items-start md:items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A]/10">
        {getIcon()}
      </div>
      <div className="flex flex-1 flex-col items-start space-y-1 pl-2.5">
        <span className="text-base font-medium text-[#000000]">{title}</span>
        <span className="text-sm font-normal text-[#3C3C3C]/80 line-clamp-1">
          {description}
        </span>
        <span className="text-xs font-normal text-[#616FF5]">{time}</span>
      </div>
      {!isRead && (
        <div className="size-[10px] rounded-full bg-[#616FF5]" />
      )}
    </div>
  );
};

export default NavBarNotification;
