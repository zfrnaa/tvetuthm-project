import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer';

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
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  contentSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  chartContainer: {
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
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
});

const ReportPDF: React.FC<PDFProps> = ({ simpleData, reportData = [], tableData = [] }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Simple Data Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionHeader}>Simple Data Section</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Assessment Count: {simpleData.assessmentCount}</Text>
            <Text>Registered Programs: {simpleData.registeredPrograms}</Text>
          </View>
          <View>
            <Text>Active Users: {simpleData.activeUsers || 0}</Text>
          </View>
        </View>
      </View>

        {/* Chart Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>Chart Section</Text>
          <View style={styles.chartContainer}>
            <Text style={{ fontSize: 10, color: '#666' }}>
              Note: Charts will appear here as images.
            </Text>
          </View>
        </View>

        {/* Data Table Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>Data Assesment Table</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>No.</Text>
              <Text style={styles.tableCell}>Assessment</Text>
              <Text style={styles.tableCell}>Score</Text>
              <Text style={styles.tableCell}>Date</Text>
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
          <Text style={styles.sectionHeader}>Data Results Table</Text>
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
                  <Text style={styles.tableCell}>{row.position}</Text>
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
export const PDFPreview: React.FC<PDFProps> = ({ simpleData, reportData, tableData = [] }) => (
  <PDFViewer style={{ width: '100%', height: '80vh' }}>
    <ReportPDF simpleData={simpleData} reportData={reportData} tableData={tableData} />
  </PDFViewer>
);

// PDF Download Link component for downloading the PDF
export const PDFDownload: React.FC<PDFProps> = ({ simpleData, reportData, tableData = [] }) => (
  <PDFDownloadLink
    document={<ReportPDF simpleData={simpleData} reportData={reportData} tableData={tableData} />}
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
      if (loading) return 'Generating PDF...';
      if (error) return 'Error generating PDF';
      return 'Download PDF';
    }}
  </PDFDownloadLink>
);

export default ReportPDF;