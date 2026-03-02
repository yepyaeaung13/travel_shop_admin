import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum NotiActionType {
  general = "general",
  account_created = "account_created",
  account_deleted = "account_deleted",
  order_new = "order_new",
  order_status = "order_status",
  payment_status = "payment_status",
  low_of_stock = "low_of_stock",
  out_of_stock = "out_of_stock",
}

type NotiType = {
  id: number;
  title: string;
  description: string;
  action: NotiActionType;
  isSeen: boolean;
  isAdmin: boolean;
  createdAt: Date;
};

type NotiState = {
  notifications: null | NotiType[];
  setNotiFications: (payload: NotiType[]) => void;
};

export const useNotiStore = create<NotiState>()(
  persist(
    (set) => ({
      notifications: null,
      setNotiFications: (payload) => set({ notifications: payload }),
    }),
    { name: "noti" },
  ),
);
