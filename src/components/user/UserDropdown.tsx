import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function UserDropdown() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logout successful");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="px-3 py-3 hover:bg-gray-100 rounded cursor-pointer border-t pt-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-72 mb-2">
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => console.log("Profile & visibility")}>
            Profile and visibility
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
