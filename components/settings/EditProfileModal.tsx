"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useUpdateProfile } from "@/queries/auth";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeConfirmModal } from "./ChangeConfirmModal";
import { UpdateProfileParams } from "@/services/auth.service";
import { toast } from "sonner";
import { LoginInfoType, useAuthStore } from "@/store/useAuthStore";

interface EditProfileModalProps {
  user: LoginInfoType;
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone Number is required"),
});

type FormValues = z.infer<typeof schema>;

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  open,
  onClose,
  onOpen,
}) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { setLoginInfo } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset: resetForm,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (!user) return;
    resetForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }, [user, resetForm]);

  const onSubmit = (data: FormValues) => {
    onClose?.();
    setConfirmModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    const values = watch();
    const payload: UpdateProfileParams = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      picture: null,
    };

    updateProfile(
      {
        payload,
        id: user.id,
      },
      {
        onSuccess: () => {
          setLoginInfo({
            ...user,
            name: values.name,
            email: values.email,
            phone: values.phone,
          });
          resetForm();
          setConfirmModalOpen(false);
          onClose?.();
          toast.success("Profile Info Updated!");
        },
        onError: (err: Error) => {
          setConfirmModalOpen(false);
          onOpen?.();
          console.error(err);
          toast.error(err?.message || "Something went wrong!");
        },
      }
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (open) {
            onClose?.();
          } else {
            onOpen?.();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="gap-0 bg-white p-0 overflow-hidden rounded-[20px]"
        >
          <DialogHeader className="sticky top-0 flex w-full flex-row items-center justify-between border-b border-gray-300 bg-white p-5">
            <h3 className="text-xl font-medium">Edit Information</h3>
            <X className="size-6 cursor-pointer" onClick={onClose} />
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-2.5 p-5"
          >
            <h4 className="text-base font-medium md:text-lg">
              Personal Information
            </h4>
            <div className="space-y-4">
               {["name", "phone", "email"].map((field) => (
              <div key={field} className="flex flex-col space-y-1">
                <label className="text-sm font-normal capitalize text-[#303030] md:text-lg">
                  {field === "phone" ? "Phone Number" : field}
                </label>
                <input
                  className={
                    "h-14 rounded-[10px] border border-[#A1A1A1] px-4 text-base font-normal text-[#303030] placeholder:text-[#A1A1A1]"
                  }
                  {...register(field as keyof FormValues)}
                  onKeyDown={(e) => {
                    if (field === "phone") {
                      const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ];

                      if (
                        !/[0-9]/.test(e.key) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }
                  }}
                />
                {errors[field as keyof FormValues] && (
                  <p className="text-sm text-red-500">
                    {errors[field as keyof FormValues]?.message}
                  </p>
                )}
              </div>
            ))}
           </div>

            <div className="flex w-full items-center justify-between gap-2.5 pt-2.5">
              <Button
                type="button"
                className="h-[41px] w-full flex-1 rounded-[10px] bg-[#A1A1A1] text-lg text-white hover:opacity-90 md:h-[47px]"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary h-[41px] w-full flex-1 rounded-[10px] text-lg text-white hover:opacity-90 md:h-[47px]"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ChangeConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        isEditInfo={true}
        loading={isPending}
      />
    </>
  );
};

export default EditProfileModal;
