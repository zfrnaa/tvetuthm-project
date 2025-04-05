"use client"

import { Area, AreaChart, CartesianGrid, } from "recharts";
import { XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { ChartNoAxesCombined, Stars, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { t } from "i18next";
import { generateAreaChartData } from "./generateAreaChartData";

const getCurrentYear = () => new Date().getFullYear();

const pieData = [
  { stars: 1, number: 1, fill: "var(--color-chrome)" },
  { stars: 2, number: 2, fill: "var(--color-safari)" },
  { stars: 5, number: 14, fill: "var(--color-firefox)" },
  { starts: 4, number: 4, fill: "var(--color-edge)" },
  { stars: 3, number: 2, fill: "var(--color-other)" },
]

const pieConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const radarData = [
  { Element: t("Context"), Score: 50 },
  { Element: t("Input"), Score: 75 },
  { Element: t("Process"), Score: 100 },
  { Element: t("Product"), Score: 80 },
]

const radarChartConfig = {
  desktop: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const areaChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface TotalAssessmentContentProps {
  chartData?: { month: string; desktop: number; mobile: number }[];
}

// 📊 **Total Assessment Line Mini Chart**
export const TotalAssessmentContentMini = ({ chartData }: TotalAssessmentContentProps) => {

  const dataToUse = chartData || generateAreaChartData();

  return (
    <div className="">
      <ChartContainer config={areaChartConfig}>
        <AreaChart
          accessibilityLayer
          data={dataToUse}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId={"a"}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId={"a"}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
};

export const TotalAssessmentContent = ({ chartData }: TotalAssessmentContentProps) => {
  const dataToUse = chartData || generateAreaChartData();

  return (
    <Card className="w-[360px] max-w-[360px] justify-self-center">
      <CardHeader className="items-center">
        <CardTitle>{t("Assessment Statistics")}</CardTitle>
        <CardDescription className="flex-wrap w-[90%] text-justify">{t("assessment_5months")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={areaChartConfig}>
          <AreaChart
            accessibilityLayer
            data={dataToUse}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId={"a"}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {(() => {
              // Use the real chart data to compute trending percentage.
              if (dataToUse && dataToUse.length >= 2) {
                const currentAssessments = dataToUse[dataToUse.length - 1].desktop;
                const previousAssessments = dataToUse[dataToUse.length - 2].desktop;
                const percentageIncrease =
                  previousAssessments > 0
                    ? ((currentAssessments - previousAssessments) / previousAssessments) * 100
                    : 0;
                return (
                  <div className="flex items-center gap-2 montserratSBold leading-none text-blue-600">
                    Trending up by {percentageIncrease.toFixed(2)}% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                );
              }
              return null;
            })()}
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June {getCurrentYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
};

export const RadarChartC = ({ data }: { data: { Element: string; Score: number }[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        {t("No data available for the selected program.")}
      </div>
    );
  }
  return (
    <Card className="w-[360] max-w-[360px]">
      <CardHeader className="items-center">
        <CardTitle>{t("Radar Chart")}</CardTitle>
        <CardDescription className="w-[90%] text-justify">
          {t("performance_CIPP")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={radarChartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart data={data} margin={{ right: 29, left: 29 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="Element" tick={{ fontSize: 12 }} />
            <PolarGrid />
            <Radar
              dataKey="Score"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 montserratSBold leading-none text-blue-600">
          {(() => {
            // Sort data by Score in descending order
            const sortedData = [...radarData].sort((a, b) => b.Score - a.Score);
            // Get top two elements
            const top1 = sortedData[0];
            const top2 = sortedData[1];

            return (
              <>
                {top1.Element} ({top1.Score}%) {t("and")} {top2.Element} ({top2.Score}%) {t("sho_strong_perf")} <ChartNoAxesCombined className="h-10 w-auto" />
              </>
            );
          })()}
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June {getCurrentYear()}
        </div>
      </CardFooter>
    </Card>
  )
}

export const PieChartC = () => {
  const totalNumbers = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.number, 0)
  }, [])
  return (
    <Card className="flex flex-col w-[360px] max-w-[360px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("Pie Chart")}</CardTitle>
        <CardDescription className="text-justify">{t("distribute_star_rating")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={pieConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="number"
              nameKey="stars"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={2}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalNumbers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t("Programs")}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 montserratSBold leading-none text-blue-600">
          Most program have 5 stars ratings <Stars className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          All programs across the faculty
        </div>
      </CardFooter>
    </ Card>
  )
}

export const TAssessmentContentMini = () => (
  <div className="p-4 bg-gray-100 rounded-lg w-1/2">
    <p className="text-base text-gray-700 mb-3">
      This shows the total number of assessments done this month.
    </p>
    {/* <Line data={graphData} options={lineChartOptions} /> */}
  </div>
);

// 🔥 **Heatmap Component**
export const TAsmtHeatMap = () => (
  <Card className="flex flex-col max-w-[370px] h-full">
    {/* <div className="p-4 rounded-lg"> */}
    <CardHeader className="items-center pb-0">
      <CardTitle>Activity Heatmap</CardTitle>
      <CardDescription>Past 3 Months</CardDescription>
    </CardHeader>
    {/* <CardContent className="flex-1 pb-0"> */}
    {/* </CardContent> */}
    {/* </div> */}
  </Card>
);

// 🏆 **Highest Rated Program**
export const HighestRatedProgramContent = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-base text-gray-700 mb-3">
      Program XYZ has received the highest rating among all programs.
    </p>
    <div className="p-3 bg-white rounded-lg shadow">
      <p className="text-base text-black">✅ Rated 5 stars by 1500+ students</p>
      <p className="text-base text-black">✅ 98% completion rate</p>
    </div>
  </div>
);

// 📚 **Total Registered Programs**
export const TotalRegisteredProgramsContent = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <p className="text-base text-gray-700">
      A total of 1235 programs are registered under TVET by the year 2025.
    </p>
    <div className="flex gap-3 mt-3">
      <p className="text-sm text-gray-500">📅 Enrollment: Open</p>
      <p className="text-sm text-gray-500">📍 Locations: 5 major cities</p>
    </div>
  </div>
);

// export const TotalAssessmentContent = () => (
//   <Card className="w-[360px] max-w-[360px] justify-self-center">
//     <CardHeader className="items-center">
//       <CardTitle>{t("Statistik Penilaian")}</CardTitle>
//       <CardDescription className="flex-wrap w-[90%] text-justify">{t("assessment_6months")}</CardDescription>
//     </CardHeader>
//     <CardContent>
//       <ChartContainer config={areaChartConfig2}>
//         <AreaChart
//           accessibilityLayer
//           data={areaChartData2}
//           margin={{
//             left: 12,
//             right: 12,
//           }}
//         >
//           <CartesianGrid vertical={false} />
//           <XAxis
//             dataKey="month"
//             tickLine={false}
//             axisLine={false}
//             tickMargin={8}
//             tickFormatter={(value) => value.slice(0, 3)}
//           />
//           <ChartTooltip
//             cursor={false}
//             content={<ChartTooltipContent indicator="line" />}
//           />
//           <Area
//             dataKey="desktop"
//             type="natural"
//             fill="var(--color-desktop)"
//             fillOpacity={0.4}
//             stroke="var(--color-desktop)"
//             stackId={"a"}
//           />
//           <Area
//             dataKey="mobile"
//             type="natural"
//             fill="var(--color-mobile)"
//             fillOpacity={0.4}
//             stroke="var(--color-mobile)"
//             stackId={"a"}
//           />
//         </AreaChart>
//       </ChartContainer>
//     </CardContent>
//     <CardFooter>
//       <div className="flex w-full items-start gap-2 text-sm">
//         <div className="grid gap-2">
//           {(() => {
//             // Dummy values (TODO: Replace these with actual data)
//             const currentAssessments = 100;
//             const previousAssessments = 95;
//             const percentageIncrease =
//               previousAssessments > 0
//                 ? ((currentAssessments - previousAssessments) / previousAssessments) * 100
//                 : 0;
//             return (
//               <div className="flex items-center gap-2 montserratSBold leading-none text-blue-600">
//                 Trending up by {percentageIncrease.toFixed(2)}% this month{" "}
//                 <TrendingUp className="h-4 w-4" />
//               </div>
//             );
//           })()}
//           <div className="flex items-center gap-2 leading-none text-muted-foreground">
//             January - June 2024
//           </div>
//         </div>
//       </div>
//     </CardFooter>
//   </Card>
// );