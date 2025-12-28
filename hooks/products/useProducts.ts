import {useProductTable} from "./useProductTable";
import {useProductListQuery} from "@/hooks/products/useProductListQuery";
import {useProductDeletion} from "@/hooks/products/useProductDeletion";
import {ProductTableColumns} from "@/components/product/table/columns";
import {useCallback, useState} from "react";

export default function useProducts() {
    const [rowSelection, setRowSelection] = useState({});
    const {
        data: products,
        pagination,
        isLoading,
        refetch,
        sort,
        search,
        handlePageSizeChange,
        handleSearchChange,
        handleSortChange,
        handlePageChange,
    } = useProductListQuery();

    const {
        dialog,
        openDeleteDialog,
        closeDeleteDialog,
        confirmDelete,
        deleteProducts,
    } = useProductDeletion(refetch);

    const columns = ProductTableColumns(openDeleteDialog);
    const table = useProductTable(products, columns, setRowSelection, rowSelection);

    const handleDeleteProducts = async () => {
        const ids = Object.keys(rowSelection).map((key) => Number(key));
        const productIds = products
            .filter((p, idx) => ids[idx] === idx)
            .map((p) => p.id);

        openDeleteDialog(productIds === undefined ? [] : productIds, products?.map((p) => p.name).join(", ") || "");
    };
    const handleDeleteProduct = useCallback(
        (id: number) => {
            const category = products?.find((cat) => cat.id === id);
            openDeleteDialog([id], category?.name || "Unknown");
        },
        [products, openDeleteDialog],
    );

    return {
        products,
        pagination,
        isLoading,
        sort,
        table,
        search,
        columns,
        deleteProducts,
        deleteDialog: dialog,
        confirmDelete,
        handleSortChange,
        handlePageChange,
        closeDeleteDialog,
        handleDeleteProduct,
        handleDeleteProducts,
        handlePageSizeChange,
        handleSearchChange,
    };
}