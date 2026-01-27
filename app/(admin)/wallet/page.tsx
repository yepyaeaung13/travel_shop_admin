"use client";

import ImageUpload from "@/assets/icons/upload/ImageUpload";
import ConfirmDialog from "@/components/confirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { CustomSwitch } from "@/components/ui/switch";
import WalletItem from "@/components/wallet/wallet-item";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export type WalletType = {
  name: string;
  type: "bank" | "pay";
};
export type WalletPay = {
  id: number;
  name: string;
  image: string;
  status: boolean;
  type: WalletType["type"];
};

const walletData: WalletPay[] = [
  {
    id: 1,
    name: "KBZPay",
    image: "/images/wallet/kpay.png",
    status: true,
    type: "pay",
  },
  {
    id: 2,
    name: "AYAPay Wallet",
    image: "/images/wallet/ayapay.png",
    status: true,
    type: "pay",
  },
  {
    id: 3,
    name: "WavePay",
    image: "/images/wallet/wavepay.png",
    status: true,
    type: "pay",
  },
  {
    id: 4,
    name: "CBPay",
    image: "/images/wallet/cbpay.png",
    status: false,
    type: "pay",
  },
  {
    id: 5,
    name: "UABPay",
    image: "/images/wallet/uabpay.png",
    status: false,
    type: "pay",
  },
  {
    id: 6,
    name: "Yoma",
    image: "/images/wallet/yomapay.png",
    status: false,
    type: "pay",
  },
  {
    id: 7,
    name: "KBZ Bank",
    image: "/images/wallet/kbzbank.png",
    status: true,
    type: "bank",
  },
  {
    id: 8,
    name: "Yoma Bank",
    image: "/images/wallet/yomapay.png",
    status: true,
    type: "bank",
  },
  {
    id: 9,
    name: "AYA Bank",
    image: "/images/wallet/ayapay.png",
    status: true,
    type: "bank",
  },
  {
    id: 10,
    name: "A Bank",
    image: "/images/wallet/abank.png",
    status: false,
    type: "bank",
  },
  {
    id: 11,
    name: "UAB Bank",
    image: "/images/wallet/uabbank.png",
    status: false,
    type: "bank",
  },
  {
    id: 11,
    name: "CB Bank",
    image: "/images/wallet/cbpay.png",
    status: false,
    type: "bank",
  },
];

const walletTypes: WalletType[] = [
  {
    name: "Digital Wallet",
    type: "pay",
  },
  {
    name: "Bank",
    type: "bank",
  },
];

const WalletPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const [selectedWalletId, setSelectedWalletId] = useState(0);
  const [selectedWalletType, setSelectedWalletType] =
    useState<WalletType["type"]>("pay");
  const [walletPays, setWalletPays] = useState(
    walletData.filter((wallet) => wallet.type === selectedWalletType),
  );
  useEffect(() => {
    setWalletPays(
      walletData.filter((wallet) => wallet.type === selectedWalletType),
    );
  }, [selectedWalletType]);

  const handlePublishStatus = (id: number) => {
    setSelectedWalletId(id);
    setPublishModalOpen(true);
  };

  const handlePublishStatusCallback = () => {
    setWalletPays((prev) => {
      return prev.map((wallet) => {
        if (wallet.id === selectedWalletId) {
          return {
            ...wallet,
            status: !wallet.status,
          };
        }
        return wallet;
      });
    });
    setPublishModalOpen(false);
  };

  const handleChangeWallet = () => {
    setSelectedWalletId(0);
    setDiscardModalOpen(true);
  }

  const handleChangeWalletCallback = () => {
    if (selectedWalletType === "pay") {
      setSelectedWalletType("bank");
    } else {
      setSelectedWalletType("pay");
    }
    setDiscardModalOpen(false)
  };

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="hidden md:flex items-center justify-between w-full">
        <h1 className="text-xl md:text-2xl font-medium text-black">
          Wallet List
        </h1>
      </div>

      <div className="flex items-start gap-7">
        {walletTypes.map((walletType, index) => (
          <div
            key={index}
            className="flex flex-col space-y-1.5 cursor-pointer"
            onClick={handleChangeWallet}
          >
            <span
              className={cn(
                "text-base md:text-lg font-medium",
                walletType.type === selectedWalletType
                  ? "text-black"
                  : "text-[#3C3C3C]/50",
              )}
            >
              {walletType.name}
            </span>
            <div
              className={cn(
                " h-1 w-full rounded-full",
                walletType.type === selectedWalletType
                  ? "bg-[#616FF5]"
                  : "bg-transparent",
              )}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5">
        <div className="col-span-1 flex flex-col w-full space-y-4">
          {walletPays
            .filter(
              (wallet) => wallet.status && wallet.type === selectedWalletType,
            )
            .map((wallet) => (
              <WalletItem
                key={wallet.id}
                wallet={wallet}
                handlePublishStatus={handlePublishStatus}
              />
            ))}
        </div>
        <div className="col-span-1 flex flex-col w-full space-y-4">
          {walletPays
            .filter(
              (wallet) => !wallet.status && wallet.type === selectedWalletType,
            )
            .map((wallet) => (
              <WalletItem
                key={wallet.id}
                wallet={wallet}
                handlePublishStatus={handlePublishStatus}
              />
            ))}
        </div>
      </div>

      <ConfirmDialog
        open={publishModalOpen}
        setOpen={setPublishModalOpen}
        callback={handlePublishStatusCallback}
        loading={false}
        title={
          walletPays.find((wallet) => wallet.id === selectedWalletId)?.status
            ? "Do you want to unpublish this wallet?"
            : "Do you want to publish this wallet?"
        }
        description={""}
        className="w-[450px]"
        titleClassName="max-w-full"
      />

      <ConfirmDialog
        open={discardModalOpen}
        setOpen={setDiscardModalOpen}
        callback={handleChangeWalletCallback}
        loading={false}
        title={"Unsaved Changes"}
        description="Are you sure you want to exit? If you leave now your current information will not be saved "
        className="w-[450px]"
        titleClassName="max-w-full"
      />
    </section>
  );
};

export default WalletPage;
