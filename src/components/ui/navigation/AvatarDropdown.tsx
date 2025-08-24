import { useUser } from '@/lib/contexts/userHooks';
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext";
import { useClerk } from '@clerk/clerk-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/solid'
import { useCallback } from 'react';

const AvatarDropdown = () => {
  const { user, loading } = useUser(); // Use our consolidated context
  const { signOut } = useClerk();
  const { isMobile } = useWindowDimensionsContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [signOut]);

  // Generate initials from the user's name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters
  };

  const userName = loading ? "Loading..." : user?.name || "Unknown User";

  return (
    <div className={"relative"}>
      <Menu>
        <MenuButton className={`inline-flex items-center gap-2 rounded-full bg-blue-600 dark:bg-darkBgAvatar py-2 ${user?.avatarUrl ? "px-1" : "px-3"} text-sm/6 font-semibold text-white shadow-inner shadow-white/50
        focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white w-12 h-12 ${isMobile ? "" : ""}`}>
          {/* Profile Icon / Initials */}
          {user?.avatarUrl ? (
            // <span className="text-lg text-white">
            <img
              src={user?.avatarUrl}
              alt={`${userName}'s avatar`}
              className="rounded-full"
              width={40}
              height={40}
              loading="lazy"
            />
            // {/* </span> */}
          ) : (
            <span className="text-lg text-white font-bold">{getInitials(userName)}</span>
          )}
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white dark:bg-gray-800 p-1 ring-1 ring-black ring-opacity-5 text-sm/6 text=black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
        >
          <div className="px-4 py-2">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>


          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={handleLogout}>
              <ArrowRightEndOnRectangleIcon className="size-4 text-red-600 dark:text-red-400" />
              Log Out
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘Q</kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}

export default AvatarDropdown