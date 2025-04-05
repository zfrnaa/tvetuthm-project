import { useNavigate } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    BarChart3,
    ClipboardCheckIcon,
    ScrollText,
    User,
} from "lucide-react"
import { useState } from "react"
import CalendarComponent from "../Calendar"
import { useTranslation } from "react-i18next";

export function SidebarMain() {
    const [activeCluster, setActiveCluster] = useState("overview")
    const navigate = useNavigate();
    const { t } = useTranslation();
    // const sidebarWidth = "var(--sidebar-width)";

    return (
        <Sidebar className="h-full border-r">
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-2 px-2 h-12">
                    <ClipboardCheckIcon className="h-6 w-6" />
                    {/* <img src="/uthm_lmark.png" alt="UTHM Logo" className="h-10 w-8" /> */}
                    <p className="font-semibold text-lg">TVET Assessment</p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="montserrat uppercase">{t("Dashboard")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeCluster === "overview"}
                                    onClick={() => {
                                        setActiveCluster("overview");
                                        navigate("/dashboard");
                                    }}
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    <span>{t("Overview")}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeCluster === "laporan"}
                                    onClick={() => {
                                        setActiveCluster("laporan");
                                        navigate("/laporan")
                                    }}>
                                    <ScrollText className="h-4 w-4" />
                                    <span>{t("Reports")}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase montserrat">{t("Management")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeCluster === "users"}
                                    onClick={() => {
                                        setActiveCluster("users")
                                        navigate("/users")
                                    }}
                                >
                                    <User className="h-4 w-4" />
                                    <span>{t("Users")}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarGroup className="p-4">
                <SidebarGroupLabel className="montserrat">{t("Calendar")}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <CalendarComponent />
                </SidebarGroupContent>
            </SidebarGroup>
        </Sidebar>
    )
}