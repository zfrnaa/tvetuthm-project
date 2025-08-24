import { useMemo } from "react";
import { Progress } from "../ui/feedback/progress";
import {
    Card,
    CardHeader,
    // TabsPanel
} from "@material-tailwind/react";
import { CardDescription, CardTitle } from "@/components/ui/cards/card";
import { CardContent } from "@mui/material";
import { Button } from "@headlessui/react";
import { useDashboardData } from "../../../model/dashboardData";
import { ArrowRightIcon } from "lucide-react";
import { ClusterData } from "@/types/ClusterTypes";

interface EvaluatedProgramProps {
    activeTab: string;
    // Add setActiveTab prop if the button needs to change the state in Dashboard
    setActiveTab: (tab: string) => void;
}

// New function to handle rendering the cluster report
export function ClusterReport({ clusterData }: { clusterData: ClusterData[] }) {

    return (
        <div className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusterData.map((cluster) => (
                <Card key={cluster.id} className="p-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <cluster.icon className="h-5 w-5" />
                                {cluster.name}
                            </CardTitle>
                            <CardDescription>{cluster.description}</CardDescription>
                        </div>
                        <div
                            className={`${cluster.color} text-white px-4 py-1 rounded-full flex-none text-sm font-medium`}
                        >
                            {cluster.score} %
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 !p-2">
                        <div className="space-y-4">
                            {cluster.metrics.map((metric, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{metric.name}</span>
                                        <span className="text-sm font-medium">{metric.value}%</span>
                                    </div>
                                    <Progress value={metric.value} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


export function EvaluatedProgramTabs({ activeTab, setActiveTab }: EvaluatedProgramProps) {
    const { clusterData } = useDashboardData();

    // Calculate the overall quality score dynamically
    const overallQualityScore = useMemo(() => {
        const totalScore = clusterData.reduce((sum, cluster) => sum + cluster.score, 0);
        const totalClusters = clusterData.length;
        return totalClusters > 0 ? (totalScore / (totalClusters * 100)) * 100 : 0;
    }, [clusterData]);

    return (
        <>
            {activeTab === "overview" && (
                // <TabsPanel value="overview" className="space-y-4" >
                <div className="space-y-4">
                    <div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" >
                            {clusterData.map((cluster) => (
                                <Card key={cluster.id} className="overflow-hidden" >
                                    <CardHeader className={`${cluster.color} text-white p-4 lg:h-[170px] md:h-[140px] sm:h-[100px] items-center`} >
                                        <div className="flex justify-between" >
                                            <cluster.icon className="h-6 w-6" />
                                            <span className="text-2xl font-bold" > {cluster.score}% </span>
                                        </div>
                                        < CardTitle className="text-white text-lg text-wrap" > {cluster.name} </CardTitle>
                                    </CardHeader>
                                    <CardContent >
                                        <CardDescription className="h-16" > {cluster.description} </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Button
                            className="mt-2 w-full p-2 rounded bg-blue-800 dark:bg-cyan-500 text-white flex flex-row justify-center items-center gap-2"
                            onClick={() => setActiveTab("details")}
                        >
                            Lihat Butiran
                            <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <Card className="p-4 pt-5 !pb-0" >
                        <CardHeader className="ml-4">
                            <CardTitle>Kualiti Program Keseluruhan</CardTitle>
                            <CardDescription>
                                Markah penilaian gabungan di seluruh kluster
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8" >
                                <div className="flex items-center justify-between" >
                                    <div className="flex flex-col gap-1" >
                                        <span className="text-3xl font-bold" > {overallQualityScore.toFixed(1)}% </span>
                                        < span className="text-sm text-muted-foreground" >
                                            Kualiti Markah Keseluruhan
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground" >
                                        Kemaskini terakhir: {new Date().toLocaleDateString()}
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
                                                    {cluster.score}%
                                                </span>
                                            </div>
                                            <Progress value={cluster.score} className="h-4" aria-label="progressCluster"/>
                                        </div>
                                    ))
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* </TabsPanel> */}
            {activeTab === "details" && (
                // <TabsPanel value="details" className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4" >
                <div className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4" >
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
                                    {cluster.score}%
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 !p-2">
                                <div className="space-y-4" >
                                    {cluster.metrics.map((metric, index) => (
                                        <div key={index} className="space-y-2" >
                                            <div className="flex items-center justify-between" >
                                                <span className="text-sm font-medium" > {metric.name} </span>
                                                <span className="text-sm font-medium" > {metric.value}% </span>
                                            </div>
                                            < Progress value={metric.value} className="h-2" aria-label="progressSubCluster"/>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {/* </TabsPanel> */}
                </div>
            )}
        </>
    );
}
