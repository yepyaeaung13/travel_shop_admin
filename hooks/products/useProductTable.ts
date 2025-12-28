import {
    getCoreRowModel,
    ColumnDef,
    OnChangeFn,
    RowSelectionState,
    useReactTable, getSortedRowModel
} from "@tanstack/react-table";
import {Product} from "@/types/product";

export function useProductTable(data: Product[], columns:  ColumnDef<Product>[],onRowSelectionChange: OnChangeFn<RowSelectionState>| undefined,rowSelection: RowSelectionState) {
    // eslint-disable-next-line react-hooks/incompatible-library
    return useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        onRowSelectionChange,
        state:{
            rowSelection,
        },
    });
}