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
} from "@/components/layout/sidebar"
import {
    BarChart3,
    ClipboardCheckIcon,
    ScrollText,
    User,
    // User,
} from "lucide-react"
import { useState } from "react"
import CalendarComponent from "../ui/data-display/Calendar"

export function SidebarMain() {
    const [activeCluster, setActiveCluster] = useState("overview")
    const navigate = useNavigate();
    // const sidebarWidth = "var(--sidebar-width)";

    return (
        <Sidebar className="h-full border-r z-0">
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-2 px-2 h-12">
                    <ClipboardCheckIcon className="h-6 w-6" />
                    {/* <img src="/uthm_lmark.png" alt="UTHM Logo" className="h-10 w-8" /> */}
                    <p className="font-semibold text-lg">Penilaian TVET</p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="montserrat uppercase">Papan Pemuka</SidebarGroupLabel>
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
                                    <span>Gambaran</span>
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
                                    <span>Laporan</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase montserrat">Pengurusan</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeCluster === "manageData"}
                                    onClick={() => {
                                        setActiveCluster("manageData")
                                        navigate("/manageData")
                                    }}
                                >
                                    <User className="h-4 w-4" />
                                    <span>Urus Data</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarGroup className="p-4">
                <SidebarGroupLabel className="montserrat">Kalendar</SidebarGroupLabel>
                <SidebarGroupContent>
                    <CalendarComponent />
                </SidebarGroupContent>
            </SidebarGroup>
        </Sidebar>
    )
}