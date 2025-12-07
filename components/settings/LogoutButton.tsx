"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { LogoutModal } from "./LogoutModal";

const LogoutButton = () => {
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  return (
    <>
        <Button
          onClick={() => setOpenLogoutModal(true)}
          className="bg-[#FFDBDB] text-[#FF3333] hover:bg-[#FF3333] hover:text-white w-full md:w-[200px] h-[47px] md:text-lg rounded-xl"
        >
          Log Out
        </Button>

      {/* Modals */}
      <LogoutModal
        isOpen={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
      />
    </>
  );
};

export default LogoutButton;
