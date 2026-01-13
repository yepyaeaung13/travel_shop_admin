"use client";

import DeleteConfirmationDialog from "@/components/common/AlertDialog";
import ProductList from "@/components/product/ProductList";
import useProducts from "@/hooks/products/useProducts";
import ProductListHeader from "@/components/product/ProductList-header";
import ProductPagination from "@/components/product/ProductPagination";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback="">
      <ProductPage />
    </Suspense>
  );
}

const ProductPage = () => {
  const {
    pagination,
    products,
    table,
    columns,
    search,
    deleteProducts,
    isLoading: isLoadingProducts,
    confirmDelete,
    deleteDialog,
    closeDeleteDialog,
    handlePageChange,
    handleSearchChange,
    handlePageSizeChange,
    handleDeleteProducts,
  } = useProducts();
  console.log("products", products)
  return (
    <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
      <ProductListHeader />
      <ProductList
        table={table}
        columns={columns}
        products={products}
        pagination={pagination}
        isLoadingProducts={isLoadingProducts}
        hasSomeSelectedRows={
          table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
        }
        // Search
        searchQuery={search}
        handleSearchChange={handleSearchChange}
        // Delete
        handleDeleteProducts={handleDeleteProducts}
      />
      <DeleteConfirmationDialog
        onConfirm={confirmDelete}
        itemType="product"
        onOpenChange={closeDeleteDialog}
        itemName={deleteDialog.productName}
        isLoading={deleteProducts.isPending}
        open={deleteDialog.open}
      />
      <ProductPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};
