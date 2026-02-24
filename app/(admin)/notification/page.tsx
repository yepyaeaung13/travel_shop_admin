import { ChevronRight } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AllNotiContainer,
  UnReadNotiContainer,
} from "@/components/notification/notification-container";

const NotificationPage = () => {
  return (
    <section className="space-y-5 rounded-[10px] bg-white p-4 md:p-5">
      <div className="flex justify-between items-center max-md:hidden">
        <h2 className="font-medium text-[#000000] md:text-xl">
          All Notifications
        </h2>
        <button className=" flex cursor-pointer items-center justify-center text-sm font-medium text-[#616FF5] hover:underline md:text-base">
          Mark as all read
        </button>
      </div>

      <Tabs defaultValue="all" className="space-y-4 md:space-y-5">
        <TabsList className="flex h-full flex-wrap max-md:w-full justify-start gap-5 bg-white">
          {["all", "unread"].map((tab) => (
            <TabsTrigger
              value={tab}
              key={tab}
              className="flex max-md:w-full max-md:flex-1 h-[46px] shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full px-4 text-base font-medium data-[state=active]:bg-[#616FF5] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#929292] md:text-lg"
            >
              {tab.slice(0, 1).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <AllNotiContainer />
        </TabsContent>
        <TabsContent value="unread">
          <UnReadNotiContainer />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default NotificationPage;
