import StoreFrontWrapper from "@/components/store-front";
import React from "react";

const StoreFrontPage = () => {
  return (
    <div className="h-full md:pb-10 space-y-5">
      <div className="max-md:hidden">
        <h2 className="text-2xl">Storefront Settings</h2>
      </div>
      <StoreFrontWrapper />
    </div>
  );
};

export default StoreFrontPage;
