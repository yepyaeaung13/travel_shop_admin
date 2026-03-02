import IconDeleteAccount from "@/assets/icons/notification/IconDeleteAccount";
import IconNewAccount from "@/assets/icons/notification/IconNewAccount";
import IconNewOrder from "@/assets/icons/notification/IconNewOrder";
import { NotiActionType } from "@/store/useNotiStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

export function formatNotificationDate(dateString: string) {
  const createdAt = dayjs(dateString);

  if (dayjs().diff(createdAt, "hour") < 24) {
    return createdAt.fromNow();
  }

  return createdAt.format("DD MMM YYYY [at] hh:mm a");
}

const NavBarNotification = ({
  notiList,
  setNotificationOpen,
}: {
  notiList: any[];
  setNotificationOpen: (value: boolean) => void;
}) => {
  const handleClosePopover = () => {
    setNotificationOpen(false);
  }
  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex w-full items-center justify-between">
        <p className="text-base font-medium text-black">Notifications</p>{" "}
      </div>

      <div className="flex flex-col space-y-4">
        {notiList.length > 0 ? (
          notiList.map((n) => (
            <NotiItem
              type={n.action}
              title={n.title}
              description={n.description}
              time={n.createdAt}
              isRead={n.isSeen}
              handleClosePopover={handleClosePopover}
            />
          ))
        ) : (
          <div>Any new noti does not have.</div>
        )}
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
  handleClosePopover
}: {
  type:
    | NotiActionType.account_created
    | NotiActionType.account_deleted
    | NotiActionType.order_new;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  handleClosePopover: () => void;
}) => {
  const router = useRouter();
  const getIcon = () => {
    switch (type) {
      case NotiActionType.order_new:
        return <IconNewOrder />;
      case NotiActionType.account_created:
        return <IconNewAccount />;
      case NotiActionType.account_deleted:
        return <IconDeleteAccount />;
      default:
        return <div></div>;
    }
  };
  return (
    <div
      onClick={() => {
        handleClosePopover();
        router.push("/notification");
      }}
      className="cursor-pointer flex w-full items-start md:items-center justify-between"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A]/10">
        {getIcon()}
      </div>
      <div className="flex flex-1 flex-col items-start space-y-1 pl-2.5">
        <span className="text-base font-medium text-[#000000]">{title}</span>
        <span className="text-sm font-normal text-[#3C3C3C]/80 line-clamp-1">
          {description}
        </span>
        <span className="text-xs font-normal text-[#616FF5]">
          {formatNotificationDate(time)}
        </span>
      </div>
      {!isRead && <div className="size-[10px] rounded-full bg-[#616FF5]" />}
    </div>
  );
};

export default NavBarNotification;
