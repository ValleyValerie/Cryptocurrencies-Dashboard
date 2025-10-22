'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardStats, ChartDataPoint, TableRow } from '@/lib/types';
import { exportToCSV, exportChartToCSV, exportStatsToJSON, exportFullReport } from '@/lib/exportUtils';

interface ExportMenuProps {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  tableData: TableRow[];
}

export default function ExportMenu({ stats, chartData, tableData }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = (type: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (type) {
      case 'table-csv':
        exportToCSV(tableData, `table-data-${timestamp}.csv`);
        break;
      case 'chart-csv':
        exportChartToCSV(chartData, `chart-data-${timestamp}.csv`);
        break;
      case 'stats-json':
        exportStatsToJSON(stats, `stats-${timestamp}.json`);
        break;
      case 'full-report':
        exportFullReport(stats, chartData, tableData, `dashboard-report-${timestamp}.json`);
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Data
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-2">
            <button
              onClick={() => handleExport('table-csv')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              <div className="font-medium">Export Table (CSV)</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Download table data as CSV</div>
            </button>
            
            <button
              onClick={() => handleExport('chart-csv')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              <div className="font-medium">Export Chart (CSV)</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Download chart data as CSV</div>
            </button>
            
            <button
              onClick={() => handleExport('stats-json')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              <div className="font-medium">Export Stats (JSON)</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Download statistics as JSON</div>
            </button>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            <button
              onClick={() => handleExport('full-report')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              <div className="font-medium">Full Report (JSON)</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Download complete dashboard data</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}