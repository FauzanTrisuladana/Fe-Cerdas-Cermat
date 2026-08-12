import { useRouter } from "@tanstack/react-router";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { logout } from "@/services/authService";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserNav() {
  const { data: user } = useUserProfile();
  const router = useRouter();

  const logoutfn = useServerFn(logout);
  const queryClient = useQueryClient();

  const getInitials = (name: string) => {
    return (name || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const logoutAndRedirect = async () => {
    try {
      await logoutfn();
      toast.success("Logout berhasil!");
      router.navigate({ to: "/login", replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Logout gagal. Coba lagi.";
      toast.error(msg);
    }
    queryClient.removeQueries({
      queryKey: ["profile"],
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-slate-100 h-12 gap-2 px-2">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage
              src={user?.profile_image ?? undefined}
              alt={user?.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-200 text-slate-700 font-bold text-xs">
              {user?.name ? (
                getInitials(user.name)
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user?.name && user.name !== "User" ? (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            ) : (
              <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
            )}
            {user?.email ? (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            ) : (
              <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
            )}
            {user?.role && (
              <p className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 w-fit px-1.5 py-0.5 rounded mt-1">
                {user.role}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Login feature disabled for auth checking - DO NOT DELETE */}
          {/* <Link to="/profile" className="w-full cursor-pointer"> */}
          {/* </Link> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Login feature disabled for auth checking - DO NOT DELETE */}
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={logoutAndRedirect}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
