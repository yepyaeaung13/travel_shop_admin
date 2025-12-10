import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const useNavStore = create<AuthState>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (value) => set({ open: value }),
    }),
    { name: "nav" }
  )
);
