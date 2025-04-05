import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
const { useTranslation } = await import ("react-i18next");
import Flag from "react-world-flags";
import AvatarDropdown from "../AvatarDropdown.tsx";
const { Menu, MenuButton, MenuItem, MenuItems } = await import ("@headlessui/react");
import { ChevronDown, Menu as MenuIcon } from "lucide-react";
import { useWindowDimensionsContext } from "@/lib/contexts/useWindowDimensionsContext.tsx";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

export const Header: React.FC = () => {
    const fullLogo = "src/assets/images/uthm_logo.png";
    const uthmLogo = "/uthm_lmark.png";
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { isMobile } = useWindowDimensionsContext();
    // Get the current window dimensions

    const tabs = [
        { label: t("Dashboard"), route: "/dashboard" },
        // { label: t("About Us"), route: "/mengenai-sistem" },
        // { label: t("Information"), route: "/maklumat" },
        { label: t("Report"), route: "/laporan" },
    ];

    const [selectedLang, setSelectedLang] = useState(i18n.language);

    const changeLanguage = (lang: string) => {
        setSelectedLang(lang);
        i18n.changeLanguage(lang);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between px-6 py-4 backdrop-blur-md z-50 relative">
                {/* ✅ Left Section: Logo */}
                <div className="flex items-center dark:bg-darkSecondary dark:shadow-inner dark:shadow-white/50 rounded-lg">
                    <img
                        src={isMobile ? uthmLogo : fullLogo}
                        alt="UTHM Logo"
                        className={`max-w-auto h-auto ${isMobile ? "!w-[80px]" : "!w-[210px]"} p-2`}
                    />
                </div>

                {/* ✅ Center Section: Tabs (Hidden on Mobile) */}
                <div className="hidden md:flex items-center space-x-6">
                    {tabs.map((tab) => (
                        <NavLink key={tab.label} to={tab.route}>
                            <button
                                className={`px-6 py-3 rounded-full transition text-sm montserratBold ${location.pathname === tab.route
                                    ? "bg-secondaryCustom dark:bg-transparent text-blue-800 dark:text-darkText"
                                    : "text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        </NavLink>
                    ))}
                </div>

                {/* ✅ Right Section: Desktop Only (Hidden on Mobile) */}
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeToggle />
                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
                            <Flag code={selectedLang === "ms" ? "MY" : "GB"} className="w-5 h-3" />
                            <span>{selectedLang.toUpperCase()}</span>
                            <ChevronDown size={16} />
                        </MenuButton>

                        <MenuItems className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg w-24">
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        className={`flex items-center gap-2 px-4 py-2 w-full ${focus ? "bg-gray-200 dark:bg-gray-700" : ""
                                            }`}
                                        onClick={() => changeLanguage("ms")}
                                    >
                                        <Flag code="MY" className="w-6 h-4" alt="Malaysia Flag|Bendera Malaysia"/>
                                        <span>MS</span>
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        className={`flex items-center gap-2 px-4 py-2 w-full ${focus ? "bg-gray-200 dark:bg-gray-700" : ""
                                            }`}
                                        onClick={() => changeLanguage("en")}
                                    >
                                        <Flag code="GB" className="w-6 h-4" alt="Britain Flag|Bendera Britain"/>
                                        <span>EN</span>
                                    </button>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Menu>

                    <AvatarDropdown />

                </div>

                {/* ✅ Mobile: Hamburger Button on the Right */}
                {isMobile && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 z-50 relative">
                                <MenuIcon size={24} />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 bg-white dark:bg-gray-900 shadow-lg">
                            {/* Close Button */}
                            <SheetClose asChild>
                                <button className="absolute top-4 right-4" type="button"></button>
                            </SheetClose>

                            {/* Navigation Tabs */}
                            <div className="flex flex-col space-y-2 mt-10">
                                {tabs.map((tab) => (
                                    <NavLink key={tab.label} to={tab.route}>
                                        <button
                                            className={`w-full text-left px-4 py-2 rounded-md transition ${location.pathname === tab.route
                                                ? "bg-blue-600 text-white"
                                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    </NavLink>
                                ))}
                            </div>

                            <div className="border-t my-4 border-gray-300 dark:border-gray-600" />

                            {/* User Options Inside Drawer */}
                            <div className="flex flex-col space-y-3 items-center">
                                <ThemeToggle />
                                <Menu>
                                    <MenuButton className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
                                        <Flag code={selectedLang === "ms" ? "MY" : "GB"} className="w-5 h-3" />
                                        <span>{selectedLang.toUpperCase()}</span>
                                        <ChevronDown size={16} />
                                    </MenuButton>
                                    <MenuItems className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg">
                                        <MenuItem>
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                                onClick={() => changeLanguage("ms")}
                                            >
                                                <Flag code="MY" className="w-6 h-4" />
                                                <span>MS</span>
                                            </button>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                                onClick={() => changeLanguage("en")}
                                            >
                                                <Flag code="GB" className="w-6 h-4" />
                                                <span>EN</span>
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                                <AvatarDropdown />
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </div>
            <div className={`border-b h-0.5 w-17/18 justify-self-center px-4 relative bg-gray-300 dark:bg-cyan-900`}></div>
        </div>
    );
};


// const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// const dropdownRef = useRef<HTMLDivElement | null>(null);
// // useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//             setIsDropdownOpen(false);
//         }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);