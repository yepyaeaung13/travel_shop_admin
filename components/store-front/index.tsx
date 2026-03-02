"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginContent from "./LoginContent";
import LandingContent from "./LandingContent";
import HomeContent from "./HomeContent";
import CategoryContent from "./CategoryContent";
import PrivacyContent from "./PrivacyContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Log In Page",
    value: "login",
    content: <LoginContent />,
  },
  {
    label: "Landing Page",
    value: "landing",
    content: <LandingContent />,
  },
  {
    label: "Home Page",
    value: "home",
    content: <HomeContent />,
  },
  {
    label: "Category Page",
    value: "category",
    content: <CategoryContent />,
  },
  {
    label: "Privacy & Policy",
    value: "privacy",
    content: <PrivacyContent />,
  },
];

const StoreFrontWrapper = () => {
  const [selectedTab, setSelectedTab] = useState("login");
  const isMobile = useIsMobile();

  if (isMobile) {
    const currentTab = tabs.find((tab) => tab.value === selectedTab);

    return (
      <div>
        {/* Mobile View - Show content when tab is selected */}
        {currentTab ? (
          <div className="space-y-4">
            {/* Back button and title */}
            <div 
              onClick={() => setSelectedTab("")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="size-6" />
              <span className="text-lg font-normal text-[#1E1E1E]">
                Back
              </span>
            </div>
            
            {/* Content */}
            <div className="mt-4">
              {currentTab.content}
            </div>
          </div>
        ) : (
          /* Tab list when no content is selected */
          <div>
            <div className="flex flex-col rounded-[10px] bg-white overflow-hidden">
              {tabs.map((tab, index) => (
                <div
                  key={tab.value}
                  onClick={() => setSelectedTab(tab.value)}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-between rounded-none w-full py-[18px] px-4",
                    index !== tabs.length - 1 && "border-b border-[#EEEEEE]",
                  )}
                >
                  <span className="text-lg font-medium text-black">
                    {tab.label}
                  </span>
                  <ChevronRight className="size-6" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        className="space-y-5"
      >
        <TabsList className="flex h-full w-full  justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              value={tab.value}
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-none w-full py-5 data-[state=active]:bg-[#E4E6FF] data-[state=inactive]:bg-white"
            >
              <span className="text-lg md:text-xl font-medium text-black">
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="login">
          <LoginContent />
        </TabsContent>
        <TabsContent value="landing">
          <LandingContent />
        </TabsContent>
        <TabsContent value="home">
          <HomeContent />
        </TabsContent>
        <TabsContent value="category">
          <CategoryContent />
        </TabsContent>
        <TabsContent value="privacy">
          <PrivacyContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreFrontWrapper;
