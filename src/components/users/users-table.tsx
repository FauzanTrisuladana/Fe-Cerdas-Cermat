import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Power, Trash2 } from "lucide-react";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserDeactivateDialog } from "./user-deactivate-dialog";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { UserRecord } from "./types";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Toaster } from "@/components/ui/sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface UsersTableProps {
  data: Array<UserRecord>;
  isLoading?: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  canManage?: boolean;
  canDelete?: boolean;
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onDelete?: (id: number) => Promise<boolean> | boolean;
  onToggleStatus?: (
    id: number,
    nextActive: boolean,
  ) => Promise<boolean> | boolean;
}

export function UsersTable({
  data,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onToggleStatus,
}: UsersTableProps) {
  const [sorting] = React.useState<SortingState>([]);

  const [userToDelete, setUserToDelete] = React.useState<UserRecord | null>(
    null,
  );
  const [userToDeactivate, setUserToDeactivate] =
    React.useState<UserRecord | null>(null);

  const handlePageChange = (newPageIndex: number) => {
    if (typeof onPageChange === "function") onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (typeof onPageSizeChange === "function") onPageSizeChange(newPageSize);
  };

  const handleToggleStatus = React.useCallback(
    async (user: UserRecord, nextActive: boolean) => {
      if (nextActive) {
        // aktivasi langsung tanpa dialog konfirmasi
        if (typeof onToggleStatus === "function") {
          await onToggleStatus(user.id, true);
        }
      } else {
        // non-aktifkan munculkan dialog konfirmasi
        setUserToDeactivate(user);
      }
    },
    [onToggleStatus],
  );

  const columns = React.useMemo<Array<ColumnDef<UserRecord>>>(
    () => [
      {
        id: "index",
        header: "No.",
        cell: ({ row }) => {
          const index =
            row.index + 1 + pagination.pageIndex * pagination.pageSize;
          return (
            <span className="text-muted-foreground font-medium">{index}.</span>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Nama",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src={row.original.profile_image || ""} />
              <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
                {row.original.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-slate-900 text-sm">
                {row.original.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const isActive = status === "Aktif";
          const isPending = status === "Pending";
          return (
            <Badge
              variant="outline"
              className={`cursor-default rounded-full h-8 gap-1.5 px-3 has-[>svg]:px-2.5 font-bold ${
                isActive
                  ? "bg-green-50 text-green-600 border-green-200"
                  : isPending
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const isActive = row.original.status === "Aktif";
          return (
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 cursor-pointer ${
                  isActive
                    ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                    : "text-green-600 hover:text-green-700 hover:bg-green-50"
                }`}
                onClick={() => handleToggleStatus(row.original, !isActive)}
                title={isActive ? "Non-aktifkan" : "Aktifkan"}
              >
                <Power className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                onClick={() => setUserToDelete(row.original)}
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [pagination.pageIndex, pagination.pageSize, handleToggleStatus],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    manualPagination: true,
    pageCount: pagination.pageCount,
  });

  const hasRows = table.getRowModel().rows.length > 0;
  const isInitialLoading = Boolean(isLoading) && !hasRows;

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          {isInitialLoading ? (
            <TableSkeleton columns={columns.length} />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header, index) => {
                      let alignClass = "text-center";
                      if (index === 1) alignClass = "text-left";
                      return (
                        <TableHead
                          key={header.id}
                          className={`font-semibold text-slate-900 ${alignClass}`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {hasRows ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-slate-50">
                      {row.getVisibleCells().map((cell, index) => {
                        let alignClass = "text-center";
                        if (index === 1) alignClass = "text-left";
                        return (
                          <TableCell
                            key={cell.id}
                            className={`py-3 ${alignClass}`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Tidak ada user ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <DataTablePagination
            pageIndex={pagination.pageIndex}
            pageCount={pagination.pageCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <UserDeleteDialog
        open={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
        user={userToDelete}
        onConfirm={async (id) => {
          if (typeof onDelete === "function") return await onDelete(id);
          return false;
        }}
      />

      <UserDeactivateDialog
        open={!!userToDeactivate}
        onOpenChange={(isOpen) => !isOpen && setUserToDeactivate(null)}
        user={userToDeactivate}
        onConfirm={async (id) => {
          if (typeof onToggleStatus === "function") {
            return await onToggleStatus(id, false);
          }
          return false;
        }}
      />

      <Toaster position="top-right" richColors closeButton theme="light" />
    </>
  );
}
