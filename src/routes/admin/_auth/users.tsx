import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { FilterBar } from "@/components/users/filter-bar-user";
import { useServerFn } from "@tanstack/react-start";
import type { UserFormErrors } from "@/components/users/types";

import { UserAddDialog } from "@/components/users/user-add-dialog";
import { UsersTable } from "@/components/users/users-table";
import HeaderComp from "@/components/shared/header-comp";
import { SearchBar } from "@/components/shared/search-bar";
import {
  createUser,
  deleteUser,
  getUsers,
  toggleUserStatus,
} from "@/services/userService";

// ─── Search Params Schema ─────────────────────────────────────────────────────
const usersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  per_page: z.number().int().positive().catch(10),
  search: z.string().optional(),
  status: z.array(z.string()).catch(["Aktif", "Pending", "Tidak Aktif"]),
});

export const Route = createFileRoute("/admin/_auth/users")({
  validateSearch: usersSearchSchema,
  component: RouteComponent,
});

// ─── Route Component ──────────────────────────────────────────────────────────
function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const queryClient = useQueryClient();

  const { page, per_page, search: searchQuery, status: statusFilter } = search;

  // API query
  const getUsersFn = useServerFn(getUsers);
  const createUserFn = useServerFn(createUser);
  const deleteUserFn = useServerFn(deleteUser);
  const toggleUserStatusFn = useServerFn(toggleUserStatus);

  const usersQuery = useQuery({
    queryKey: [
      "users",
      {
        page,
        per_page,
        search: searchQuery,
        status: statusFilter,
      },
    ],
    queryFn: async () => {
      const response = await getUsersFn({
        data: {
          params: {
            page,
            per_page,
            search: searchQuery,
            status: statusFilter,
          },
        },
      });
      return response;
    },
    staleTime: 1000 * 60 * 2,
  });

  const total = usersQuery.data ? usersQuery.data.meta.total : 0;
  const pageCount = usersQuery.data ? usersQuery.data.meta.last_page : 1;
  const pageIndex = Math.max(page - 1, 0);

  const pagination = {
    pageIndex,
    pageSize: per_page,
    pageCount,
    total,
  };

  const [open, setOpen] = useState(false);
  const [addErrors, setAddErrors] = useState<UserFormErrors>(null);

  const handleSearchChange = (value: string) => {
    navigate({
      to: "/admin/users",
      search: (prev: any) => ({
        ...prev,
        search: value === "" ? undefined : value,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleStatusFilterChange = (selectedStatuses: Array<string>) => {
    navigate({
      to: "/admin/users",
      search: (prev: any) => ({
        ...prev,
        status: selectedStatuses,
        page: 1,
      }),
      replace: true,
    });
  };

  const handleAdd = async (payload: {
    name: string;
    email: string;
  }): Promise<boolean> => {
    setAddErrors(null);
    try {
      const result = await createUserFn({
        data: { nama: payload.name, email: payload.email },
      });
      toast.success(result?.message || "User berhasil ditambahkan");
      queryClient.invalidateQueries();
      setOpen(false);
      return true;
    } catch (error: any) {
      const errors = error?.response?.data?.errors as UserFormErrors;
      setAddErrors(errors);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menambahkan user";
      toast.error(msg);
      return false;
    }
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    try {
      const result = await deleteUserFn({ data: { id } });
      toast.success(result?.message || "User berhasil dihapus");
      queryClient.invalidateQueries();
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal menghapus user";
      toast.error(msg);
      return false;
    }
  };

  const handleToggleStatus = async (
    id: number,
    nextActive: boolean,
  ): Promise<boolean> => {
    try {
      const result = await toggleUserStatusFn({ data: { id } });
      toast.success(
        result?.message ||
          (nextActive
            ? "User berhasil diaktifkan"
            : "User berhasil dinon-aktifkan"),
      );
      queryClient.invalidateQueries();
      return true;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal mengubah status user";
      toast.error(msg);
      return false;
    }
  };

  return (
    <>
      <HeaderComp
        title="Manajemen User"
        description="Kelola data pengguna sistem"
        icon={<Plus />}
        actionLabel={"Tambah User"}
        onAction={() => setOpen(true)}
      />

      <UserAddDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setAddErrors(null);
        }}
        onCreate={handleAdd}
        errors={addErrors}
      />

      <SearchBar
        placeholder="Cari pengguna..."
        className="mb-1"
        value={searchQuery ?? ""}
        onChange={(event) => handleSearchChange(event.target.value)}
      />

      <FilterBar
        onStatusFilterChange={handleStatusFilterChange}
        isLoading={usersQuery.isLoading}
        className="mb-4"
      />

      <UsersTable
        data={usersQuery.data?.data ?? []}
        isLoading={usersQuery.isLoading}
        pagination={pagination}
        onPageChange={(newPageIndex: number) => {
          navigate({
            to: "/admin/users",
            search: (prev: any) => ({
              ...prev,
              page: newPageIndex + 1,
            }),
            replace: true,
          });
        }}
        onPageSizeChange={(newPageSize: number) => {
          navigate({
            to: "/admin/users",
            search: (prev: any) => ({
              ...prev,
              per_page: newPageSize,
              page: 1,
            }),
            replace: true,
          });
        }}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </>
  );
}
