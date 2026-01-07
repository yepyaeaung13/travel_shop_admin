import React from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import IconSadShoppingBasket from "@/utils/icons/IconSadShoppingBasket";

interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    itemType: "category" | "product" | "variant" | string;
    itemName?: string;
    isLoading?: boolean;
    title?: string;
    description?: string;
}

export default function DeleteConfirmationDialog({
                                                     open,
                                                     onOpenChange,
                                                     onConfirm,
                                                     itemType,
                                                     itemName,
                                                     isLoading = false,
                                                     title,
                                                     description,
                                                 }: DeleteConfirmationDialogProps) {
    const defaultTitle = title || `Do you want to delete this ${itemType}?`;
    const defaultDescription = description || "This action cannot be undone";

    const handleCancel = () => {
        if (!isLoading) {
            onOpenChange(false);
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md rounded-[10px] border-none bg-white p-0 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="absolute top-4 right-4 cursor-pointer rounded-full p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <X className="h-6 w-6 text-gray-600"/>
                </button>

                {/* Content */}
                <div className="flex flex-col items-center px-6 py-8 text-center">
                    {/* Icon */}
                    <div className="mt-10 mb-3">
                        <IconSadShoppingBasket className="size-24 text-red-500"/>
                    </div>

                    {/* Title */}
                    <AlertDialogHeader className="flex flex-col items-center">
                        <AlertDialogTitle className="text-lg font-medium text-neutral-900">
                            {defaultTitle}
                            {itemName && itemName?.length > 0 && (
                                <span className="block text-center text-lg font-medium text-gray-700">
                  &ldquo;{itemName}&rdquo;
                </span>
                            )}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="!text-base">
                            {defaultDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Buttons */}
                    <AlertDialogFooter className="mt-8 flex w-full gap-4">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="h-12 flex-1 rounded-full bg-gray-400 text-white hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="h-12 flex-1 rounded-full bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
