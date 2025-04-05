import { useState } from "react";
import { Progress } from "./ui/progress";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardHeader,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsPanel
} from "@material-tailwind/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import { Button } from "@headlessui/react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useDashboardData } from "../../model/dashboardData";

export function EvaluatedProgramTabs() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("overview");
    const { clusterData, recentAssessments, recentAssessmentColumns } = useDashboardData();

    // Create the table instance
    const recentAsmtTable = useReactTable({
        data: recentAssessments,
        columns: recentAssessmentColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 flex-col" >
            <TabsList className="bg-white dark:bg-gray-700 w-fit" >
                <TabsTrigger value="overview" > {t("Overview")} </TabsTrigger>
                <TabsTrigger value="details" > {t("Cluster Details")} </TabsTrigger>
                <TabsTrigger value="recent" > {t("Recent Assessment")} </TabsTrigger>
            </TabsList>
            {activeTab === "overview" && (
                <TabsPanel value="overview" className="space-y-4" >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" >
                        {clusterData.map((cluster) => (
                            <Card key={cluster.id} className="overflow-hidden" >
                                <CardHeader className={`${cluster.color} text-white p-4 lg:h-[170px] md:h-[140px] sm:h-[100px] items-center`} >
                                    <div className="flex justify-between" >
                                        <cluster.icon className="h-6 w-6" />
                                        <span className="text-2xl font-bold" > {cluster.score} % </span>
                                    </div>
                                    < CardTitle className="text-white text-lg text-wrap" > {cluster.name} </CardTitle>
                                </CardHeader>
                                <CardContent >
                                    <CardDescription className="h-16" > {cluster.description} </CardDescription>
                                    < Button
                                        className="mt-2 w-full"
                                        onClick={() => setActiveTab("details")
                                        }
                                    >
                                        {t("View Details")}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Card className="p-2" >
                        <CardHeader>
                            <CardTitle>{t("Overall PQuality")} </CardTitle>
                            <CardDescription>
                                {t("overall_pgm_desc")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8" >
                                <div className="flex items-center justify-between" >
                                    <div className="flex flex-col gap-1" >
                                        <span className="text-3xl font-bold" > 81.4 % </span>
                                        < span className="text-sm text-muted-foreground" >
                                            {t("Overall QScore")}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground" >
                                        Last updated: {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="space-y-4" >
                                    {clusterData.map((cluster) => (
                                        <div key={cluster.id} className="space-y-2" >
                                            <div className="flex items-center justify-between" >
                                                <div className="flex items-center gap-2" >
                                                    <cluster.icon className="h-4 w-4" />
                                                    <span className="text-sm font-medium" >
                                                        {cluster.name}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium" >
                                                    {cluster.score} %
                                                </span>
                                            </div>
                                            <Progress value={cluster.score} className="h-4" />
                                        </div>
                                    ))
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsPanel>
            )}
            {activeTab === "details" && (
                <TabsPanel value="details" className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4" >
                    {clusterData.map((cluster) => (
                        <Card key={cluster.id} className="p-4" >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" >
                                <div className="space-y-1" >
                                    <CardTitle className="flex items-center gap-2" >
                                        <cluster.icon className="h-5 w-5" />
                                        {cluster.name}
                                    </CardTitle>
                                    <CardDescription> {cluster.description} </CardDescription>
                                </div>
                                <div className={`${cluster.color} text-white px-4 py-1 rounded-full flex-none text-sm font-medium`} >
                                    {cluster.score} %
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 !p-2">
                                <div className="space-y-4" >
                                    {cluster.metrics.map((metric, index) => (
                                        <div key={index} className="space-y-2" >
                                            <div className="flex items-center justify-between" >
                                                <span className="text-sm font-medium" > {metric.name} </span>
                                                <span className="text-sm font-medium" > {metric.value} % </span>
                                            </div>
                                            < Progress value={metric.value} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsPanel>
            )}
            {activeTab === "recent" && (
                <TabsPanel value="recent" className="space-y-4" >
                    <Card className="p-2" >
                        <CardHeader>
                            <CardTitle>Recent Programme Assessments</CardTitle>
                            <CardDescription>
                                Latest completed programme quality assessments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border min-w-fit overflow-x-auto scrollbar-medium scrollbar-track-gray-200 scrollbar-thumb-gray-400" >
                                <table className="min-w-[500px] border-collapse" >
                                    <thead>
                                        {recentAsmtTable.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id} className="bg-muted" >
                                                {headerGroup.headers.map(header => (
                                                    <th key={header.id} className="p-3 text-sm font-medium" >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )
                                                        }
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {recentAsmtTable.getRowModel().rows.map(row => (
                                            <tr key={row.id} className="border-t" >
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id} className="p-3 text-sm" >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())
                                                        }
                                                    </td>
                                                ))
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsPanel>
            )}
        </Tabs>
    );
}
