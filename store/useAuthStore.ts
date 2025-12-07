import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LoginInfoType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  picture: string | null;
  role: string;
};

type AuthState = {
  loginInfo: LoginInfoType | null;
  setLoginInfo: (payload: LoginInfoType | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loginInfo: null,
      setLoginInfo: (payload) => set({ loginInfo: payload }),
    }),
    { name: "auth" }
  )
);
