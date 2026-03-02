"use client";

import React, { useEffect, useState } from "react";
import NotificationItem from "./notification-item";
import { useGetNoti, useNotiMarkAsAllRead } from "@/queries/noti";
import { Button } from "../ui/button";

const UnReadNotiContainer = () => {
  const [limit, setLimit] = useState(10);
  const [list, setList] = useState([]);
  const isSeen = false;
  const { data: notiList, isLoading } = useGetNoti(limit, isSeen);
  const { mutate: markAsAllRead, isPending } = useNotiMarkAsAllRead();

  useEffect(() => {
    if (notiList?.data) {
      setList(notiList.data);
    }
  }, [notiList]);

  const handleMarkAsAllRead = () => {
    markAsAllRead();
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex md:hidden w-full items-center justify-between">
        <p className="text-lg font-medium text-[#1A1A1A] md:text-xl">New</p>
        <button
          onClick={handleMarkAsAllRead}
          disabled={isPending}
          className=" flex cursor-pointer items-center justify-center gap-2 text-sm font-normal text-[#616FF5] hover:underline md:text-base"
        >
          Mark as all read
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        {
          // isLoading ? (
          //   <p className="w-full text-center mt-24">loading...</p>
          // ) :
          list.length > 0 ? (
            list.map((n: any) => (
              <NotificationItem
                type={n.action}
                title={n.title}
                description={n.description}
                time={n.createdAt}
                isRead={n.isSeen}
              />
            ))
          ) : !isLoading ? (
            <div className="w-full flex justify-center mt-24">
              No new notifications.
            </div>
          ) : null
        }

        {notiList?.data?.length === limit && (
          <div className="flex w-full justify-center">
            <Button
              onClick={() => setLimit((prev) => prev + 10)}
              className="h-[46px] w-[158px] bg-[#1A1A1A] text-sm font-normal text-white hover:border hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] md:w-[240px] md:text-base"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const AllNotiContainer = () => {
  const [limit, setLimit] = useState(10);
  const [list, setList] = useState([]);
  const { data: notiList, isLoading } = useGetNoti(limit);
  const { mutate: markAsAllRead, isPending } = useNotiMarkAsAllRead();

  useEffect(() => {
    if (notiList?.data) {
      setList(notiList.data);
    }
  }, [notiList]);

  const handleMarkAsAllRead = () => {
    markAsAllRead();
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="md:hidden flex w-full items-center justify-between">
        <p className="text-lg font-medium text-[#1A1A1A] md:text-xl">New</p>
        <button
          onClick={handleMarkAsAllRead}
          disabled={isPending}
          className=" flex cursor-pointer items-center justify-center gap-2 text-sm font-normal text-[#616FF5] hover:underline md:text-base"
        >
          Mark as all read
        </button>
      </div>

      {/* New Notifications  */}
      <div className="flex flex-col space-y-4">
        {
          // isLoading ? (
          //   <p className="w-full text-center mt-24">loading...</p>
          // ) :
          list.length > 0 ? (
            list.map((n: any) => (
              <NotificationItem
                type={n.action}
                title={n.title}
                description={n.description}
                time={n.createdAt}
                isRead={n.isSeen}
              />
            ))
          ) : !isLoading ? (
            <div className="w-full flex justify-center mt-24">
              You don't have any notifications yet.
            </div>
          ) : null
        }
        {notiList?.data?.length === limit && (
          <div className="flex w-full justify-center">
            <Button
              onClick={() => setLimit((prev) => prev + 10)}
              className="h-[46px] w-[158px] bg-[#1A1A1A] text-sm font-normal text-white hover:border hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] md:w-[240px] md:text-base"
            >
              Load More
            </Button>
          </div>
        )}
        {/* <div className="h-[1px] w-full bg-[#A1A1A1]/50" /> */}
      </div>

      {/* <div className="flex flex-col space-y-4">
        <NotificationItem
          type="order"
          title="New Order!"
          description="Jared Padalecki made a new order. (Order ID- #0055)"
          time="1h ago"
          isRead={false}
        />
        <NotificationItem
          type="account"
          title="Account created"
          description="Customer created account “Jensen”"
          time="1h ago"
          isRead={false}
        />
      </div> */}
    </div>
  );
};

export { UnReadNotiContainer, AllNotiContainer };
