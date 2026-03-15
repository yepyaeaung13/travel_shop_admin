import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  Table as ReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { User } from "@/types/users.types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import IconLoading from "@/components/Loading";

interface Props {
  table: ReactTable<User>;
  columns: ColumnDef<User>[];
  loading: boolean;
}

const TableWrapper = ({ table, columns, loading }: Props) => {
  const router = useRouter();
  const handleRowClick = (rowData: any) => {
    router.push(`/customers/${rowData.id}`);
  };
  return (
    <div className="min-h-80 bg-white rounded-b-[20px]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="h-auto bg-[#EEEEEE] text-lg text-[#3C3C3C] hover:bg-[#EEEEEE]"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="py-4"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => handleRowClick(row.original)}
                className={cn(
                  "cursor-pointer bg-white text-lg font-normal text-[#303030]",
                  table.getRowModel().rows.length - 1 === index &&
                    "rounded-b-[20px]",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="py-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : !loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-80 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      {loading && (
        <div className="flex h-96 w-full items-center justify-center">
          <IconLoading className="size-40" />
        </div>
      )}
    </div>
  );
};

export default TableWrapper;
