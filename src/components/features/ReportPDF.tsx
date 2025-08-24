import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Svg,
  Rect,
  Line,
  G,
  Path,
} from '@react-pdf/renderer';
import { generatePieData, getPieColor, getShortInstitutionName } from '@/lib/utils/chartUtils';

export interface SimpleDataType {
  assessmentCount: number;
  registeredPrograms: number;
  activeUsers?: number;
}
export interface ReportDataRow {
  name: string;
  institution: string;
  faculty: string;
  programName: string;
  position: string;
  [key: string]: string;
}

export interface TableDataRow {
  assessment: string;
  score: string;
  date: string;
  [key: string]: string | number;
}

export interface PDFProps {
  simpleData: SimpleDataType;
  reportData?: ReportDataRow[];
  tableData?: TableDataRow[];
  assessmentChartData?: { month: string; User: number; }[];
  pieChartProgramsData?: { programId: string; programName: string; starRating?: number }[]; // Data needed to generate pie chart
  institutionChartData?: { institution: string; Assessments: number }[];
  radarChartData?: string;
  scatterChartData?: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  contentSection: {
    marginBottom: 20,
    breakInside: 'avoid',
  },
  sectionHeader: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  chartContainer: {
    padding: 5,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  tableContainer: {
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  horizontalChartLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  chartColumn: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  barLabel: {
    fontSize: 8,
    textAlign: 'right',
  },
  barValueLabel: {
    fontSize: 8,
    marginLeft: 2,
  },
  axisLabel: {
    fontSize: 9,
  },
  pieLabel: {
    fontSize: 7,
    fill: '#333', // Use a standard color
  },
});

interface Point {
  x: number;
  y: number;
}

function getControlPoints(p0: Point, p1: Point, p2: Point, p3: Point, tension: number = 0.4): [Point, Point] {
  const t: number = tension;
  // Calculate tangent vectors (scaled differences)
  const t1x: number = (p2.x - p0.x) * t;
  const t1y: number = (p2.y - p0.y) * t;
  const t2x: number = (p3.x - p1.x) * t;
  const t2y: number = (p3.y - p1.y) * t;

  // Control point 1 (after p1)
  const cp1x: number = p1.x + t1x / 3;
  const cp1y: number = p1.y + t1y / 3;

  // Control point 2 (before p2)
  const cp2x: number = p2.x - t2x / 3;
  const cp2y: number = p2.y - t2y / 3;

  return [{ x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }];
}

// Generates the SVG path string 'd' attribute for a smooth curve through points
// Interface for points with x and y coordinates
interface ScaledPoint {
  x: number;
  y: number;
}

/**
 * Generates the SVG path string 'd' attribute for a smooth curve through points
 * @param scaledPoints Array of points with x,y coordinates
 * @returns SVG path data string
 */
function generateCurvePathString(scaledPoints: ScaledPoint[]): string {
  if (!scaledPoints || scaledPoints.length < 2) return "";

  let path = `M ${scaledPoints[0].x},${scaledPoints[0].y}`; // Move to the first point

  for (let i = 0; i < scaledPoints.length - 1; i++) {
      // Define points p0, p1, p2, p3 for the segment p1 -> p2
      const p0: Point = scaledPoints[i === 0 ? 0 : i - 1]; // Handle start: use p1 as p0
      const p1: Point = scaledPoints[i];
      const p2: Point = scaledPoints[i + 1];
      const p3: Point = scaledPoints[i + 2 < scaledPoints.length ? i + 2 : i + 1]; // Handle end: use p2 as p3

      // Get control points for the curve segment from p1 to p2
      const [cp1, cp2]: [Point, Point] = getControlPoints(p0, p1, p2, p3);

      // Append cubic Bézier command (C)
      path += ` C ${cp1.x.toFixed(2)},${cp1.y.toFixed(2)} ${cp2.x.toFixed(2)},${cp2.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return path;
}

const PdfHorizontalBarChart: React.FC<{
  title: string;
  data: { institution: string; Assessments: number }[];
}> = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <Text style={{ fontSize: 10, textAlign: 'center' }}>Tiada data carta institusi.</Text>;
  }

  const chartHeight = data.length * 25 + 30; // Calculate height based on bars + padding
  const chartWidth = 480; // Available width in points (A4 width ~595, minus padding)
  const maxLabelWidth = 80; // Space for institution names
  const barAreaWidth = chartWidth - maxLabelWidth; // Width for bars
  const maxValue = Math.max(...data.map(d => d.Assessments), 0);

  // Simple scaling function
  const scaleX = (value: number) => (value / maxValue) * barAreaWidth;

  // Use HSL/Hex colors directly
  const barColor = '#3b82f6'; // Example: Blue-600 hex equivalent

  return (
    <View style={styles.contentSection}>
      <Text style={styles.chartTitle}>{title}</Text>
      <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Render Bars and Labels */}
        {data.map((item, index) => {
          const yPos = index * 25 + 15; // Position each bar vertically
          const barWidth = scaleX(item.Assessments);
          return (
            <G key={item.institution}>
              {/* Institution Label */}
              <Text x={maxLabelWidth - 5} y={yPos + 4} style={styles.barLabel} textAnchor="end">
                {getShortInstitutionName(item.institution)}
              </Text>
              {/* Bar Rectangle */}
              <Rect
                x={maxLabelWidth}
                y={yPos}
                width={barWidth}
                height={15} // Bar height
                fill={barColor}
              />
              {/* Value Label (Optional) */}
              <Text x={maxLabelWidth + barWidth + 2} y={yPos + 4} style={styles.barValueLabel}>
                {item.Assessments}
              </Text>
            </G>
          );
        })}
        {/* Basic Y Axis Line (Optional) */}
        <Line x1={maxLabelWidth} y1={10} x2={maxLabelWidth} y2={chartHeight - 10} stroke="#999999" strokeWidth={0.5} />
        {/* Basic X Axis Line (Optional) */}
        <Line x1={maxLabelWidth} y1={chartHeight - 15} x2={chartWidth - 5} y2={chartHeight - 15} stroke="#999999" strokeWidth={0.5} />
        {/* X Axis Labels (Optional Example) */}
        <Text x={maxLabelWidth} y={chartHeight - 5} style={styles.axisLabel}>0</Text>
        <Text x={chartWidth - 5} y={chartHeight - 5} style={styles.axisLabel} textAnchor="end">{maxValue}</Text>
      </Svg>
    </View>
  );
};

const PdfPieChart: React.FC<{
  title: string;
  programsData: { starRating?: number }[];
}> = ({ title, programsData }) => {
  if (!programsData || programsData.length === 0) {
    return <Text style={{ fontSize: 10, textAlign: 'center' }}>Tiada data carta pai.</Text>;
  }

  const pieData = generatePieData(programsData); // Use your existing logic
  const totalValue = pieData.reduce((sum, item) => sum + item.number, 0);

  if (totalValue === 0) {
    return <Text style={{ fontSize: 10, textAlign: 'center' }}>Tiada program dengan penarafan untuk carta pai.</Text>;
  }

  const chartSize = 150; // Diameter of the pie chart
  const radius = chartSize / 2;
  const cx = radius;
  const cy = radius;
  let startAngle = 0;

  const getSlicePath = (value: number, startAng: number, currentRadius: number): [string, number, number, number] => {
    const angle = (value / totalValue) * 360;
    const endAngle = startAng + angle;
    const largeArcFlag = angle > 180 ? 1 : 0;

    // Calculate start and end points on the circle
    const startX = cx + currentRadius * Math.cos((startAng * Math.PI) / 180);
    const startY = cy + currentRadius * Math.sin((startAng * Math.PI) / 180);
    const endX = cx + currentRadius * Math.cos((endAngle * Math.PI) / 180);
    const endY = cy + currentRadius * Math.sin((endAngle * Math.PI) / 180);

    // SVG path data for the arc
    const d = [
      `M ${cx},${cy}`, // Move to center
      `L ${startX},${startY}`, // Line to start of arc
      `A ${currentRadius},${currentRadius} 0 ${largeArcFlag} 1 ${endX},${endY}`, // Arc
      'Z', // Close path back to center
    ].join(' ');

    // Calculate midpoint angle for label positioning (optional)
    const midAngle = startAng + angle / 2;
    const labelX = cx + (currentRadius * 0.7) * Math.cos((midAngle * Math.PI) / 180); // Position label inside slice
    const labelY = cy + (currentRadius * 0.7) * Math.sin((midAngle * Math.PI) / 180);

    return [d, endAngle, labelX, labelY];
  };

  const fallbackColors: { [key: string]: string } = {
    "var(--color-chrome)": "#f87171", // Red-400
    "var(--color-safari)": "#fbbf24", // Amber-400
    "var(--color-other)": "#a3e635", // Lime-400 (Assuming 'other' maps here)
    "var(--color-edge)": "#34d399", // Emerald-400
    "var(--color-firefox)": "#60a5fa", // Blue-400
    "default": "#9ca3af" // Gray-400
  };

  const resolveColor = (cssVar: string): string => {
    return fallbackColors[cssVar] || fallbackColors["default"];
  };

  return (
    <View style={styles.contentSection}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        <Svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
          {pieData.map((item) => {
            if (item.number === 0) return null; // Don't draw 0-value slices

            const [pathData, nextAngle, labelX, labelY] = getSlicePath(item.number, startAngle, radius);
            const colorVar = getPieColor(item.stars);
            const fillColor = resolveColor(colorVar);
            startAngle = nextAngle; // Update start angle for the next slice

            return (
              <G key={item.stars}>
                <Path d={pathData} fill={fillColor} stroke="#fff" strokeWidth={0.5} />
                {/* Optional: Add labels inside slices */}
                <Text x={labelX} y={labelY + 2} textAnchor="middle" style={styles.pieLabel}>
                  {`${item.stars}Bintang (${item.number})`}
                </Text>
              </G>
            );
          })}
        </Svg>
      </View>
      {/* Simple Legend */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 5 }}>
        {pieData.map(item => item.number > 0 ? (
          <View key={item.stars} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 3 }}>
            <Rect width={8} height={8} fill={getPieColor(item.stars)} />
            <Text style={{ fontSize: 8, marginLeft: 3 }}>{item.stars}⭐ ({item.number})</Text>
          </View>
        ) : null)}
      </View>
    </View>
  );
}

// --- Placeholder for Area Chart ---
const PdfAreaChart: React.FC<{
  title: string;
  data: { month: string; User: number }[];
}> = ({ title, data }) => {
  if (!data || data.length === 0) {
    return <Text style={{ fontSize: 10, textAlign: 'center' }}>Tiada data carta dijumpai.</Text>;
  }

  const chartWidth = 480;
  const chartHeight = 150;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 }; // Add left padding for Y labels

  const contentWidth = chartWidth - padding.left - padding.right;
  const contentHeight = chartHeight - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.User), 0);
  const effectiveMaxValue = maxValue === 0 ? 1 : maxValue;
  const minValue = 0; // Assuming area chart starts from 0

  // Scaling functions
  const scaleX = (index: number) => padding.left + (index / (data.length - 1)) * contentWidth;
  // Adjusted scaleY to handle maxValue being 0
  const scaleY = (value: number) => padding.top + contentHeight - ((value - minValue) / (effectiveMaxValue - minValue)) * contentHeight;

  const scaledPoints = data.map((item, index) => ({
    x: scaleX(index),
    y: scaleY(item.User)
  }));

  // 2. Generate the smooth curve path string for the top line
  const curveLinePath = generateCurvePathString(scaledPoints);

  // 3. Generate the path for the filled area
  const startPointX = scaleX(0);
  const endPointX = scaleX(data.length - 1);
  const bottomY = scaleY(minValue);

  // Generate path data for the filled area
  const areaPath = `M ${startPointX},${bottomY} ${curveLinePath.substring(1)} L ${endPointX},${bottomY} Z`;

  const areaColor = '#60a5fa'; // Example Blue-400
  const lineColor = '#2563eb'; // Example Blue-600

  return (
    <View style={styles.contentSection}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Y Axis Line */}
          <Line
            x1={padding.left} y1={padding.top}
            x2={padding.left} y2={padding.top + contentHeight}
            stroke="#cccccc" strokeWidth={0.5}
          />
          {/* X Axis Line */}
          <Line
            x1={padding.left} y1={padding.top + contentHeight}
            x2={padding.left + contentWidth} y2={padding.top + contentHeight}
            stroke="#cccccc" strokeWidth={0.5}
          />

          {/* Area Fill */}
          <Path d={areaPath} fill={areaColor} fillOpacity={0.4} />
          {/* Line Stroke */}
          <Path d={curveLinePath} fill="none" stroke={lineColor} strokeWidth={1.5} />

          {/* X Axis Labels */}
          {data.map((item, index) => (
            <Text
              key={item.month}
              x={scaleX(index)}
              y={chartHeight - padding.bottom + 10} // Position below X axis line
              textAnchor="middle"
              style={styles.axisLabel}
            >
              {item.month.slice(0, 3)} {/* Short month name */}
            </Text>
          ))}

          {/* Y Axis Labels (Example: Min and Max) */}
          <Text
            x={padding.left - 5} y={scaleY(minValue) + 3} // Position left of Y axis
            textAnchor="end" style={styles.axisLabel}
          >
            {minValue}
          </Text>
          <Text
            x={padding.left - 5} y={scaleY(maxValue) + 3} // Position left of Y axis
            textAnchor="end" style={styles.axisLabel}
          >
            {maxValue}
          </Text>
        </Svg>
      </View>
    </View>
  );
}

const ReportPDF: React.FC<PDFProps> = ({ simpleData, reportData = [], tableData = [], assessmentChartData, institutionChartData, pieChartProgramsData }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Simple Data Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeader}>Bahagian Data Mudah</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Kiraan Penilaian: {simpleData.assessmentCount}</Text>
            <Text>Program Berdaftar: {simpleData.registeredPrograms}</Text>
          </View>
          <View>
            <Text>Pelawat: {simpleData.activeUsers || 0}</Text>
          </View>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeader}>Chart Section</Text>
        {/* <View style={styles.chartContainer}> */}
        {assessmentChartData && (
          <PdfAreaChart title="Penilaian Bulanan" data={assessmentChartData} />
        )}
        {institutionChartData && (
          <PdfHorizontalBarChart title="Penilaian Mengikut Institusi" data={institutionChartData} />
        )}
        {pieChartProgramsData && (
          <PdfPieChart title="Taburan Penarafan Bintang" programsData={pieChartProgramsData} />
        )}
        {/* </View> */}
      </View>

      {/* Data Table Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeader}>Jadual Penilaian Data</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>No.</Text>
            <Text style={styles.tableCell}>Penilaian</Text>
            <Text style={styles.tableCell}>Skor</Text>
            <Text style={styles.tableCell}>Tarikh</Text>
          </View>
          {tableData.length > 0 ? (
            tableData.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{i + 1}</Text>
                <Text style={styles.tableCell}>{row.assessment}</Text>
                <Text style={styles.tableCell}>{row.score}</Text>
                <Text style={styles.tableCell}>{row.date}</Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', fontSize: 10 }}>
              No data available
            </Text>
          )}
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionHeader}>Jadual Keputusan Data</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Nama</Text>
            <Text style={styles.tableCell}>Insitusi</Text>
            <Text style={styles.tableCell}>Fakulti</Text>
            <Text style={styles.tableCell}>Program Name</Text>
            <Text style={styles.tableCell}>Jawatan</Text>
          </View>
          {reportData.length > 0 ? (
            reportData.map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableCell}>{row.name}</Text>
                <Text style={styles.tableCell}>{row.institution}</Text>
                <Text style={styles.tableCell}>{row.faculty}</Text>
                <Text style={styles.tableCell}>{row.programName}</Text>
                <Text style={styles.tableCell}>
                  {row.position.charAt(0).toUpperCase() + row.position.slice(1)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', fontSize: 10 }}>
              No data available
            </Text>
          )}
        </View>
      </View>
    </Page>
  </Document>
);

// PDF Preview component for viewing the PDF
export const PDFPreview: React.FC<PDFProps> = (props) => (
  <PDFViewer style={{ width: '100%', height: '80vh' }}>
    <ReportPDF {...props} />
  </PDFViewer>
);

// PDF Download Link component for downloading the PDF
export const PDFDownload: React.FC<PDFProps> = (props) => (
  <PDFDownloadLink
    document={<ReportPDF {...props} />}
    fileName={`laporan_assessment_${new Date()
      .toLocaleDateString('en-GB')
      .replace(/\//g, '-')}.pdf`}
    style={{
      textDecoration: 'none',
      padding: '10px 16px',
      color: '#fff',
      backgroundColor: '#1976D2',
      borderRadius: '4px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    }}
  >
    {({ loading, error }) => {
      if (loading) return 'Menjana PDF...';
      if (error) return 'Ralat menjana PDF';
      return 'Muat turun PDF';
    }}
  </PDFDownloadLink>
);

export default ReportPDF;