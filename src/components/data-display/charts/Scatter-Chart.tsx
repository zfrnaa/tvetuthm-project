import { useState, useEffect, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions, AgCartesianAxisOptions, AgScatterSeriesOptions } from "ag-charts-community";
import { useResults } from "../../../hooks/useResults";
import { Timestamp } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../ui/cards/card";

// Define the structure for processed data points
interface ScatterDataPoint {
    date: Date;
    score: number;
}

// Define props for the component
interface ScatterChartProps {
    programId: string;
    programName?: string; //Pass program name for title
}

// Define a more specific type for Cartesian chart options
type AgCartesianChartOptions = Omit<AgChartOptions, 'series' | 'axes'> & {
    series?: AgScatterSeriesOptions[]; // Use the specific series type
    axes?: AgCartesianAxisOptions[]; // Use the specific axis type
};

interface ProcessedChartData {
    data: ScatterDataPoint[];
    minDate: Date;
    maxDate: Date;
}

export const ScatterChart = ({ programId, programName }: ScatterChartProps) => {
    const { data: resultsData, isLoading, isError } = useResults(); // Fetch all results
    const [options, setOptions] = useState<AgCartesianChartOptions>({
        background: { visible: false },
        axes: [],
        series: [],
        legend: { enabled: false }, // Disable legend if only one series
    });

    // Process data when resultsData or programId changes
    const processedData = useMemo<ProcessedChartData>(() => {
        // Calculate the date range: Today and 7 days prior
        const today = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(today.getDate() - 9);
        const tenDaysAgoDefault = new Date();
        tenDaysAgoDefault.setDate(today.getDate() - 9);
        today.setHours(23, 59, 59, 999);
        tenDaysAgoDefault.setHours(0, 0, 0, 0);

        if (!resultsData || !programId) {
            // Return default range even if no data/programId yet
            return { data: [], minDate: tenDaysAgo, maxDate: today };
        }

        // 1. Filter and map all relevant data points for the program first
        const filteredData = resultsData
            .filter(report => report.programId === programId && report.completed_at && report.totalScore !== undefined)
            .map(report => {
                // ... (date parsing logic remains the same) ...
                let dateValue: Date | null = null;
                const completedAt = report.completed_at;

                if (completedAt && typeof completedAt === 'object') {
                    if ('toDate' in completedAt && typeof (completedAt as any).toDate === 'function') {
                        dateValue = (completedAt as Timestamp).toDate();
                    } else if ('seconds' in completedAt && typeof (completedAt as any).seconds === 'number') {
                        dateValue = new Date((completedAt as { seconds: number }).seconds * 1000);
                    }
                } else if (typeof completedAt === 'string') {
                    dateValue = new Date(completedAt);
                } else if (typeof completedAt === 'number') {
                    dateValue = new Date(completedAt);
                }

                const scoreValue = typeof report.totalScore === 'number' ? report.totalScore : 0;

                return {
                    date: dateValue,
                    score: scoreValue,
                };
            })
            .filter((item): item is ScatterDataPoint => item.date instanceof Date && !isNaN(item.date.getTime()))
            // Filter by the calculated date range
            .filter(item => item.date >= tenDaysAgo && item.date <= today)
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        // 2. Determine the date range based on the latest data point
        let minDateRange: Date = tenDaysAgoDefault;
        let maxDateRange: Date = today;

        if (filteredData.length > 0) {
            // Find the latest date from the filtered data
            const latestDataPointDate = filteredData[filteredData.length - 1].date;

            // Set maxDateRange to the end of the latest data point's day
            maxDateRange = new Date(latestDataPointDate);
            maxDateRange.setHours(23, 59, 59, 999);

            // Set minDateRange to the start of the day 9 days before the latest data point's day
            minDateRange = new Date(latestDataPointDate);
            minDateRange.setDate(minDateRange.getDate() - 9);
            minDateRange.setHours(0, 0, 0, 0);

            console.log("Min Date Range:", minDateRange.toLocaleDateString(), "Max Date Range:", maxDateRange.toLocaleDateString());
        }
        // If allProgramDataPoints is empty, the default range (today and 9 days ago) will be used for the axes

        // 3. Filter the data points based on the determined date range
        const filteredDataForRange = filteredData.filter(item =>
            item.date >= minDateRange && item.date <= maxDateRange
        );

        // Return the processed data along with the calculated range
        return { data: filteredDataForRange, minDate: minDateRange, maxDate: maxDateRange };

    }, [resultsData, programId]);

    // Update chart options when processedData changes
    useEffect(() => {
        const { data: data, minDate, maxDate } = processedData;

        const seriesConfig: AgScatterSeriesOptions[] = [{
            type: 'scatter',
            data: data,
            xKey: 'date',
            xName: 'Tarikh Selesai', // Translate axis name
            yKey: 'score',
            yName: 'Jumlah Skor', // Translate axis name
            title: programName || 'Markah Penilaian', // Use program name or default title
            marker: {
                size: 8, // Adjust marker size if needed
            },
            tooltip: { // Move tooltip renderer here
                renderer: params => {
                    // Need to check params.datum exists and has the properties
                    if (!params.datum || !(params.datum.date instanceof Date)) {
                        return { title: 'Ralat', content: 'Titik data tidak sah' };
                    }
                    const date = params.datum.date.toLocaleDateString();
                    // Access the score from the datum object using the yKey
                    const score = params.datum.score;
                    // Use series title if available, fallback to default
                    const title = params.title || 'Penilaian';
                    return {
                        title: title,
                        content: `Tarikh: ${date}<br>Skor: ${score}`
                    };
                }
            }
        } as AgScatterSeriesOptions]; // Explicitly assert the type here

        const axesConfig: AgCartesianAxisOptions[] = [
            {
                type: 'time',
                position: 'bottom',
                title: { text: 'Tarikh Selesai' }, // Translate axis title
                label: {
                    format: '%d %b %Y', // Format date labels (e.g., 20 Apr 2025)
                    rotation: -30, // Rotate labels if they overlap
                },
                min: minDate,
                max: maxDate,
                nice: false, // Prevent axis from overriding min/max
                interval: {
                    step: 1
                }
            },
            {
                type: 'number',
                position: 'left',
                title: { text: 'Jumlah Skor' },
                min: 0,
                max: 135
            },
        ];

        // Update the chart options state
        setOptions({
            background: { visible: false },
            title: {
                text: programName || 'Markah Penilaian',
                enabled: false, // Title is handled by CardTitle
            },
            series: seriesConfig,
            axes: axesConfig,
            legend: { enabled: false }, // Keep legend disabled for single series
            padding: { top: 20, right: 30, bottom: 60, left: 60 },
            tooltip: {
                enabled: true, // Ensure tooltips are generally enabled
            },
        });
    }, [processedData, programName]); // Add t to dependency array

    // Handle loading, error, and no data states
    if (isLoading) {
        return (
            <Card className="w-full max-w-[600px] h-[400px] flex items-center justify-center">
                <CardContent>Memuatkan data carta...</CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="w-full max-w-[600px] h-[400px] flex items-center justify-center">
                <CardContent>Ralat memuatkan data carta.</CardContent>
            </Card>
        );
    }

    if (processedData.data.length === 0 && programId) {
        return (
            <Card className="w-full max-w-[600px] h-[400px] flex items-center">
                <CardHeader className="items-center pb-0">
                    <CardTitle className="text-justify trim">{programName || 'Markah Penilaian'}</CardTitle>
                    <CardDescription>Skor per Tarikh</CardDescription>
                </CardHeader>
                <CardContent>Tiada data penilaian tersedia untuk program ini.</CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-[600px]"> {/* Adjust width as needed */}
            <CardHeader className="items-center pb-0">
                {/* Use programName if available, otherwise a default title */}
                <CardTitle className="text-justify">{programName || 'Markah Penilaian'}</CardTitle>
                <CardDescription>Skor per Tarikh</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <div style={{ height: "100%" }}> {/* Ensure container has fixed height */}
                    <AgCharts options={options} />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Setiap mata mewakili markah penilaian yang lengkap.
                </div>
            </CardFooter>
        </Card>
    );
};