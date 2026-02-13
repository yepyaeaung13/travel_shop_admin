"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import IconLogoWhite from "../icons/IconLogoWhite";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAdminLogin } from "@/queries/auth";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { errorToast, successToast } from "@/components/toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { mutate: login, isPending } = useAdminLogin();
  const { setLoginInfo } = useAuthStore();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    login(
      { email, password },
      {
        onSuccess: (res) => {
          if (res?.success) {
            const userData = res?.data?.userInfo;

            successToast("Success","Login successfully.");

            setLoginInfo(userData);

            Cookies.set("accessToken", res?.data?.accessToken, {
              expires: 7,
              path: "/",
            });
            Cookies.set("refreshToken", res?.data?.refreshToken, {
              expires: 7,
              path: "/",
            });
            window.location.href = "/product";
          } else {
            errorToast("Failed",
              res?.response?.data?.message || res?.error || "Login failed. Please try again."
            );
            setLoginError(
              res?.response?.data?.message || res?.error || "Login failed. Please try again."
            );
          }
        },
        onError: (error: any) => {
          console.log("Login Error: ", error);
          toast.error(error.response?.data?.message || "Login failed. Please try again.");
          setLoginError(error.response?.data?.message || "Login failed. Please try again.");
        },
      }
    );
  };

  return (
    <>
      <div className={cn("relative mx-auto hidden bg-white md:block")}>
        <div className={cn("mx-auto h-full min-h-screen max-w-[1200px]")}>
          <header className="px-8 pb-4 pt-8">
            <h1 className="text-3xl font-bold text-gray-800">
              <IconLogoWhite />
            </h1>
          </header>
          <div className="flex w-full items-center justify-between p-4">
            <div className=" flex w-full items-center justify-center md:h-[470px] md:gap-20">
              <div className="flex w-[603px] justify-center">
                <Image
                  alt="Illustration of people interacting with charts and data visualizations"
                  className="w-full md:w-[550px] md:pl-10"
                  src="/images/login-night.png"
                  width={603}
                  height={446}
                />
              </div>
              <div
                className={cn(
                  "flex h-full w-[550px] flex-col justify-center rounded-[20px] border-2 border-[#616FF5] bg-[#616FF5]/30 px-14 shadow-lg"
                )}
              >
                <div className="text-center">
                  <h2
                    className={cn(
                      "mb-2 text-2xl font-medium md:text-3xl md:font-bold "
                    )}
                  >
                    Login to Account
                  </h2>
                  <p className="mb-8 text-sm md:text-lg">
                    Please enter your email and password to continue
                  </p>
                </div>
                <form onSubmit={handleLogin} className="">
                  <div className="mb-4">
                    <label
                      className="mb-2 block text-sm font-medium md:text-lg"
                      htmlFor="email"
                    >
                      Email address:
                    </label>
                    <Input
                      className={cn(
                        "h-[41px] w-full rounded-[10px] border px-3 focus:outline-none md:h-12 2xl:px-4",
                        "border-[#3C3C3C] placeholder:text-[#3C3C3C]"
                      )}
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      type="email"
                      required
                    />
                  </div>
                  <div className="mb-10">
                    <label
                      className="mb-2 block text-sm font-medium md:text-lg"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Input
                        className={cn(
                          "h-[41px] w-full rounded-[10px] border px-3 pr-10 focus:outline-none md:h-12 2xl:px-4 ",
                          "border-[#3C3C3C] placeholder:text-[#3C3C3C]"
                        )}
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                      >
                        {showPassword ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    className={cn(
                      "h-[41px] w-full rounded-[10px] px-3 text-base font-normal transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:h-12 md:text-xl md:font-medium 2xl:px-4 bg-[#616FF5] text-white"
                    )}
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
                {loginError && (
                  <p className="mt-4 px-3 text-sm text-red-500">{loginError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cn("h-full bg-white md:hidden")}>
        <header className="absolute left-0 top-0 p-8">
          <IconLogoWhite className="w-45" />
        </header>
        <div className="flex min-h-screen items-center justify-center">
          <div className="container mx-auto grid grid-cols-1 items-center">
            <div className="flex justify-center">
              <Image
                alt="Illustration of people interacting with charts and data visualizations"
                className="w-[80%] max-w-lg"
                src="/images/login-night.png"
                width={600}
                height={400}
              />
            </div>
            <div className="flex justify-center">
              <div className={cn("w-full max-w-md px-6 py-8 text-[#303030]")}>
                <div className="text-center">
                  <h2 className={cn("mb-2 text-2xl font-medium")}>
                    Login to Account
                  </h2>
                  <p className="mb-4 text-sm font-medium text-[#303030]">
                    Please enter your email and password to continue
                  </p>
                </div>
                <form onSubmit={handleLogin} className="">
                  <div className="mb-4">
                    <label
                      className="mb-2 block text-sm font-medium"
                      htmlFor="email"
                    >
                      Email address:
                    </label>
                    <Input
                      className={cn(
                        "h-auto w-full rounded-[10px] border border-[#3C3C3C] px-3 py-2 placeholder:text-[#3C3C3C] focus:outline-none 2xl:rounded-[20px] 2xl:px-4 2xl:py-3"
                      )}
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      type="email"
                      required
                    />
                  </div>
                  <div className="mb-[30px]">
                    <label
                      className="mb-2 block text-sm font-medium"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Input
                        className={cn(
                          "h-auto w-full rounded-[10px] border border-[#3C3C3C] px-3 py-2 pr-10 placeholder:text-[#3C3C3C] focus:outline-none 2xl:rounded-[20px] 2xl:px-4 2xl:py-3"
                        )}
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                      >
                        {showPassword ? (
                          <Eye className="size-4" />
                        ) : (
                          <EyeOff className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    className={cn(
                      "h-auto w-full rounded-[10px] bg-[#616FF5] px-3 py-3 font-bold text-white transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    )}
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
                {loginError && (
                  <p className="mt-4 text-sm text-red-500">{loginError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
