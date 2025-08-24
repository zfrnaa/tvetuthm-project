import { Area, AreaChart, CartesianGrid, Bar, BarChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, Label, Pie, PieChart, Sector, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";
import { ChartNoAxesCombined, Stars, TrendingUp } from "lucide-react";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { generateAreaChartData } from "./Generate-Area-Chart";
import { usePrograms } from "@/hooks/usePrograms";
import { generatePieData, getShortInstitutionName } from "@/lib/utils/chartUtils";

const getCurrentYear = () => new Date().getFullYear();

type PieDataItem = {
  stars: number;
  number: number;
  fill: string;
};

//old pieData
// const pieData: PieDataItem[] = [
//   { stars: 1, number: 1, fill: "var(--color-chrome)" },
//   { stars: 2, number: 2, fill: "var(--color-safari)" },
//   { stars: 3, number: 3, fill: "var(--color-firefox)" },
//   { stars: 4, number: 4, fill: "var(--color-edge)" }, // Fixed "starts" typo to "stars"
//   { stars: 5, number: 12, fill: "var(--color-other)" },
// ]

const pieConfig = {
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

// Utility function to calculate rating counts and max star rating
const calculateStarRatings = (data: PieDataItem[]) => {
  const ratingCounts = data.reduce((acc, curr) => {
    const stars = curr.stars || 0;
    return {
      ...acc,
      [stars]: (acc[stars] || 0) + curr.number,
    };
  }, {} as Record<number, number>);

  const maxStarRating = Object.entries(ratingCounts).sort((a, b) => b[1] - a[1])[0];

  return { ratingCounts, maxStarRating };
};

const getMaxStarRatingText = (maxStarRating: [string, number] | undefined) => {
  if (!maxStarRating) return "";
  const [stars, count] = maxStarRating;

  // If max count is 1, check if there might be a balance in ratings
  if (count === 1) {
    return "Penarafan Seimbang di antara semua program";
  }

  return `Kebanyakan program mempunyai penarafan ${stars} bintang (${count} program).`;
};

// Utility function to translate and format the trending text
const getTrendingText = (current: number, previous: number) => {
  if (previous <= 0) return "Trend meningkat sebanyak 0% bulan ini";
  const percentageIncrease = ((current - previous) / previous) * 100;
  return `Trend meningkat sebanyak ${percentageIncrease.toFixed(2)}% bulan ini`;
};

const radarChartConfig = {
  desktop: {
    label: "Score",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig

const areaChartConfig = {
  desktop: {
    label: "User",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface TotalAssessmentContentProps {
  chartData?: { month: string; User: number; }[];
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
            dataKey="User"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
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
    <Card className="w-full max-w-[360px] h-full">
      <CardHeader className="items-center">
        <CardTitle>Statistik Penilaian</CardTitle>
        <CardDescription className="flex-wrap w-[90%] text-justify">Menunjukkan penilaian keseluruhan untuk 5 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
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
              dataKey="User"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
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
                const currentAssessments = dataToUse[dataToUse.length - 1].User;
                const previousAssessments = dataToUse[dataToUse.length - 2].User;

                return (
                  <div className="flex items-center gap-2 montserratSBold leading-none text-blue-600">
                    {getTrendingText(currentAssessments, previousAssessments)} <TrendingUp className="h-4 w-4" />
                  </div>
                );
              }
              return null;
            })()}
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {new Date(new Date().setMonth(new Date().getMonth() - 5)).toLocaleString('default', { month: 'long' })} - {new Date().toLocaleString('default', { month: 'long' })} {getCurrentYear()}
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
        Tiada data tersedia untuk program yang dipilih.
      </div>
    );
  }
  return (
    <Card className="w-full max-w-[600px] lg:max-w-[382px]">
      <CardHeader className="items-center">
        <CardTitle>Carta Radar</CardTitle>
        <CardDescription className="w-[90%] text-justify">
          Menunjukkan prestasi berdasarkan model CIPP
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
            const sortedData = [...data].sort((a, b) => b.Score - a.Score);
            // Get top two elements
            const top1 = sortedData[0];
            const top2 = sortedData[1];

            return (
              <>
                {top1.Element} ({top1.Score.toFixed(2)}%) dan {top2.Element} ({top2.Score.toFixed(2)}%) menunjukkan prestasi terbaik<ChartNoAxesCombined className="h-10 w-auto" />
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
  const { data: programs } = usePrograms();

  // Aggregate star ratings
  const pieData = React.useMemo(() => {
    if (!programs) return [];
    return generatePieData(programs);
  }, [programs]);

  const totalNumbers = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.number, 0)
  }, [pieData])

  // Find the index of the segment with the most programs
  const activeIndex = React.useMemo(() => {
    if (!pieData || pieData.length === 0) return -1; // Return -1 if no data
    let maxIndex = 0;
    let maxNumber = pieData[0]?.number || 0;
    pieData.forEach((item, index) => {
      if (item.number > maxNumber) {
        maxNumber = item.number;
        maxIndex = index;
      }
    });
    // If all segments have 0 programs, don't highlight any
    return maxNumber > 0 ? maxIndex : -1;
  }, [pieData]);

  const { maxStarRating } = React.useMemo(() => calculateStarRatings(pieData), [pieData]);

  return (
    <Card className="flex flex-col w-full max-w-[360px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Carta Pai</CardTitle>
        <CardDescription className="flex-wrap w-[90%] text-justify">Pengagihan program mengikut penarafan bintang</CardDescription>
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
              paddingAngle={2}
              strokeWidth={5}
              activeIndex={activeIndex}
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
                          Program
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
        <div className="flex items-center gap-2 montserratSBold leading-none text-blue-600 text-justify">
          {maxStarRating && (
            <>
              {getMaxStarRatingText(maxStarRating)} <Stars className="h-6 w-auto" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Semua program di seluruh fakulti
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
  </div>
);

interface HorizontalBarChartProps {
  chartData: { institution: string; Assessments: number }[];
  fullDataLength: number; // Total number of institutions
  onShowAllClick: () => void; // Function to handle button click
  hideShowAllButton?: boolean; // Optional prop to hide the button
}

const horizontalCConfig = {
  desktop: {
    label: "Assessments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// Helper function to get short institution name or acronym

export const HorizontalBarChart = ({ chartData, fullDataLength, onShowAllClick, hideShowAllButton = false }: HorizontalBarChartProps) => {

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="flex flex-col w-full max-w-[360px] items-center">
        <CardHeader>
          <CardTitle>Penilaian mengikut Universiti</CardTitle>
          <CardDescription>Pengagihan penilaian di seluruh universiti</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tiada data penilaian tersedia.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full max-w-[360px] h-full">
      <CardHeader>
        <CardTitle>Penilaian mengikut Institusi</CardTitle>
        <CardDescription>{new Date(new Date().setMonth(new Date().getMonth() - 5)).toLocaleString('default', { month: 'long' })} - {new Date().toLocaleString('default', { month: 'long' })} {getCurrentYear()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow w-full">
        <ChartContainer config={horizontalCConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              bottom: 5,
            }}
          >
            <XAxis type="number" dataKey="Assessments" hide />
            <YAxis
              dataKey="institution"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={getShortInstitutionName}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="Assessments" fill="var(--chart-1)" radius={5} />
          </BarChart>
        </ChartContainer>
        {fullDataLength > 5 && !hideShowAllButton && (
          <Button
            variant="link"
            className="mt-1 p-0 h-auto text-blue-600 dark:text-blue-400" // Adjusted styling
            onClick={onShowAllClick}
            aria-label="to show all institution data"
          >
            Lihat Semua Institusi ({fullDataLength})
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* Optional: Update dynamic footer content */}
        {(() => {
          const sortedVisibleData = [...chartData].sort((a, b) => b.Assessments - a.Assessments);
          const topInstitution = sortedVisibleData[0];
          if (!topInstitution) return null;
          return (
            <div className="flex gap-2 font-medium leading-none text-justify">
              {`${topInstitution.institution} mempunyai penilaian terbanyak (${topInstitution.Assessments})`}
            </div>
          );
        })()}
        <div className="leading-none text-muted-foreground text-justify">
          {/* Adjust description based on whether all data is shown */}
          {hideShowAllButton
            ? `Menunjukkan jumlah penilaian mengikut semua ${fullDataLength} institusi`
            : `Menunjukkan jumlah penilaian mengikut 5 institusi pertama`}
        </div>
      </CardFooter>
    </Card>
  )
}