import { useDeleteProducts } from "@/queries/product";
import { toast } from "sonner";
import { useState } from "react";

export function useProductDeletion(onDeleteSuccess?: () => void) {
    const [dialog, setDialog] = useState({
        open: false,
        productIds: [] as number[],
        productName: "",
    });
    const deleteProducts = useDeleteProducts();

    const confirmDelete = async () => {
        if (!dialog.productIds.length) return;
        try {
            const res = await deleteProducts.mutateAsync(dialog.productIds);
            if (res.status) {
                toast.success("Product deleted successfully!");
                onDeleteSuccess?.();
            } else {
                toast.error("Failed to delete product");
            }
        } catch {
            toast.error("An error occurred while deleting");
        } finally {
            setDialog({ open: false, productIds: [], productName: "" });
        }
    };

    return {
        dialog,
        openDeleteDialog: (ids: number[], name: string) =>
            setDialog({ open: true, productIds: ids, productName: name }),
        closeDeleteDialog: () =>
            setDialog({ open: false, productIds: [], productName: "" }),
        confirmDelete,
        deleteProducts,
    };
}