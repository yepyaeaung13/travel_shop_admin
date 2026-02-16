"use client";

import ConfirmDialog from "@/components/confirm-dialog/confirm-dialog";
import { successToast } from "@/components/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletItem from "@/components/wallet/wallet-item";
import { cn } from "@/lib/utils";
import { useGetPayments, useUpdateStatusPayment } from "@/queries/payment";
import React, { useEffect, useState } from "react";

export type WalletType = {
  name: string;
  type: "bank" | "pay";
};
export type WalletPay = {
  id: number;
  name: string;
  accountName: string;
  accountNumber: string;
  image: string;
  status: boolean;
  qrCode: string | null;
};

const WalletPage = () => {
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletPay | null>(null);

  const [selectedWalletType, setSelectedWalletType] =
    useState<WalletType["type"]>("pay");

  const { data: paymentMethods, isLoading } = useGetPayments();
  const { mutate: updateStatusPayment, isPending } = useUpdateStatusPayment();

  const bankPayments = paymentMethods?.data?.find(
    (m: any) => m.type === "bank",
  );
  const walletPayments = paymentMethods?.data?.find(
    (m: any) => m.type === "pay",
  );

  const handlePublishStatus = (wallet: WalletPay) => {
    setSelectedWallet(wallet);
    setPublishModalOpen(true);
  };

  const handleChangeWalletCallback = () => {
    if (selectedWalletType === "pay") {
      setSelectedWalletType("bank");
    } else {
      setSelectedWalletType("pay");
    }
    setDiscardModalOpen(false);
  };

  const handleUpdatePayment = async () => {
    if (!selectedWallet) {
      return;
    }

    const payload = {
      id: selectedWallet.id,
      payload: {
        status: !selectedWallet.status,
      },
    };
    updateStatusPayment(payload, {
      onSuccess: () => {
        setPublishModalOpen(false);
        setSelectedWallet(null);
        successToast("Updated", "Payment's status update successfully.");
      },
    });
  };

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="hidden md:flex items-center justify-between w-full">
        <h1 className="text-xl md:text-2xl font-medium text-black">
          Wallet List
        </h1>
      </div>

      <div className="flex items-start gap-7">
        <Tabs defaultValue="pay" className="w-full">
          <TabsList className="bg-transparent gap-5">
            <TabsTrigger
              value="pay"
              className={cn(
                "text-base md:text-lg font-medium rounded-none border-0 border-b-4 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:border-blue-500 text-[#3C3C3C]/50 pb-4",
              )}
            >
              Digital Wallet
            </TabsTrigger>
            <TabsTrigger
              value="bank"
              className={cn(
                "text-base md:text-lg font-medium rounded-none border-0 border-b-4 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:border-blue-500 text-[#3C3C3C]/50 pb-4",
              )}
            >
              Bank
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bank">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5">
              <div className="col-span-1 flex flex-col w-full space-y-4">
                {bankPayments?.payments
                  .sort((a: any, b: any) => a.name.localeCompare(b.name))
                  .slice(0, 3)
                  .map((bank: any) => (
                    <WalletItem
                      key={bank.id}
                      wallet={bank}
                      type="bank"
                      handlePublishStatus={handlePublishStatus}
                    />
                  ))}
              </div>
              <div className="col-span-1 flex flex-col w-full space-y-4">
                {bankPayments?.payments
                  .sort((a: any, b: any) => a.name.localeCompare(b.name))
                  .slice(3, 6)
                  .map((bank: any) => (
                    <WalletItem
                      key={bank.id}
                      wallet={bank}
                      type="bank"
                      handlePublishStatus={handlePublishStatus}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="pay">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5">
              <div className="col-span-1 flex flex-col w-full space-y-4">
                {walletPayments?.payments
                  .sort((a: any, b: any) => a.name.localeCompare(b.name))
                  .slice(0, 3)
                  .map((wallet: any) => (
                    <WalletItem
                      key={wallet.id}
                      wallet={wallet}
                      type="pay"
                      handlePublishStatus={handlePublishStatus}
                    />
                  ))}
              </div>
              <div className="col-span-1 flex flex-col w-full space-y-4">
                {walletPayments?.payments
                  .sort((a: any, b: any) => a.name.localeCompare(b.name))
                  .slice(3, 6)
                  .map((wallet: any) => (
                    <WalletItem
                      key={wallet.id}
                      wallet={wallet}
                      type="pay"
                      handlePublishStatus={handlePublishStatus}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDialog
        open={publishModalOpen}
        setOpen={setPublishModalOpen}
        callback={handleUpdatePayment}
        loading={isPending}
        title={
          selectedWallet?.status
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
