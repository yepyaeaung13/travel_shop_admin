"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useChangeSellerPassword, useUpdateProfile } from "@/queries/auth";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeConfirmModal } from "./ChangeConfirmModal";
import { PasswordChangeSellerParams } from "@/services/auth.service";
import { toast } from "sonner";
import { LoginInfoType } from "@/store/useAuthStore";

interface ChangePasswordModalProps {
  user: LoginInfoType;
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const inputFields = [
  {
    name: "oldPassword",
    label: "Old Password",
    placeholder: "Old Password",
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "New Password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
  },
];

const schema = z
  .object({
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) => !val || /[A-Z]/.test(val),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (val) => !val || /[a-z]/.test(val),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (val) => !val || /[0-9]/.test(val),
        "Password must contain at least one number"
      )
      .refine(
        (val) => !val || /[^A-Za-z0-9]/.test(val),
        "Password must contain at least one special character"
      )
      .refine(
        (val) => !val || val.length >= 8,
        "Password must be at least 8 characters"
      ),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  user,
  open,
  onClose,
  onOpen,
}) => {
  const { mutate: updatePassword, isPending } = useChangeSellerPassword();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset: resetForm,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    onClose?.();
    setConfirmModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    const values = watch();
    const payload: PasswordChangeSellerParams = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };

    updatePassword(
      {
        payload,
        id: user.id,
      },
      {
        onSuccess: () => {
          toast.success("Password Updated!");
          setConfirmModalOpen(false);
          onClose?.();
          resetForm();
        },
        onError: (err: Error) => {
          toast.error(err?.message || "Something went wrong!");
          setConfirmModalOpen(false);
          onOpen?.();
          console.error(err);
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
          className="gap-0 bg-white p-0 rounded-[20px] overflow-hidden"
        >
          <div className="flex w-full flex-row items-center justify-between bg-white p-5 pb-0">
            <h2 className="text-base font-medium md:text-xl text-black">
              Change Password
            </h2>
            <X className="size-6 cursor-pointer" onClick={onClose} />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 p-5"
          >
            {inputFields.map((field) => (
              <div key={field.name} className="flex flex-col space-y-1">
                <label className="text-sm font-normal capitalize text-[#303030] md:text-lg">
                  {field.label}
                </label>
                <input
                  type="password"
                  placeholder={field.placeholder}
                  className={
                    "h-14 rounded-[10px] border border-[#A1A1A1] px-4 text-base font-normal text-[#303030] placeholder:text-[#A1A1A1]"
                  }
                  {...register(field.name as keyof FormValues)}
                />
                {errors[field.name as keyof FormValues] && (
                  <p className="text-sm text-red-500">
                    {errors[field.name as keyof FormValues]?.message}
                  </p>
                )}
              </div>
            ))}

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
        isEditInfo={false}
        loading={isPending}
      />
    </>
  );
};

export default ChangePasswordModal;
