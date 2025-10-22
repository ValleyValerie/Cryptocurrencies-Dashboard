// src/lib/exportUtils.ts
import { TableRow, ChartDataPoint, DashboardStats } from './types';

export function exportToCSV(data: TableRow[], filename: string = 'export.csv') {
  const headers = ['Name', 'Status', 'Value', 'Date'];
  const rows = data.map(row => [
    row.name,
    row.status,
    row.value.toString(),
    row.date
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

export function exportChartToCSV(data: ChartDataPoint[], filename: string = 'chart-data.csv') {
  const headers = ['Timestamp', 'Value'];
  const rows = data.map(point => [
    new Date(point.timestamp).toISOString(),
    point.value.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

export function exportStatsToJSON(stats: DashboardStats, filename: string = 'dashboard-stats.json') {
  const jsonContent = JSON.stringify(stats, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

export function exportFullReport(
  stats: DashboardStats,
  chartData: ChartDataPoint[],
  tableData: TableRow[],
  filename: string = 'dashboard-report.json'
) {
  const report = {
    generatedAt: new Date().toISOString(),
    stats,
    chartData,
    tableData
  };

  const jsonContent = JSON.stringify(report, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}