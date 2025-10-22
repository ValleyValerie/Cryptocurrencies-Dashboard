'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/Dashboard/StatsCard';
import LiveChart from '@/components/Dashboard/LiveChart';
import DataTable from '@/components/Dashboard/DataTable';
import { DashboardStats, ChartDataPoint, TableRow, User } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0,
    growth: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time stats updates
    socket.on('stats-update', (data: DashboardStats) => {
      setStats(data);
    });

    // Listen for chart data updates
    socket.on('chart-update', (data: ChartDataPoint[]) => {
      setChartData(data);
    });

    // Listen for table data updates
    socket.on('table-update', (data: TableRow[]) => {
      setTableData(data);
    });

    return () => {
      socket.off('stats-update');
      socket.off('chart-update');
      socket.off('table-update');
    };
  }, [socket]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50  dark:bg-gray-900">
      <Navbar userName={user.name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total market cap"
            value={stats.totalUsers.toLocaleString()}
            trend={parseFloat(stats.growth.toString())}
            trendLabel="from last month"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatsCard
            title="24h trading volume"
            value={stats.activeUsers.toLocaleString()}
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Revenue"
            value={`$${(stats.revenue / 1000).toFixed(1)}k`}
            trend={parseFloat(stats.growth.toString())}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Growth Rate"
            value={`${stats.growth}%`}
            trend={parseFloat(stats.growth.toString())}
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <LiveChart data={chartData}  />
        </div>

        {/* Table */}
        <DataTable data={tableData} title="Top cryptocurrencies" />

        {/* Connection Status */}
        {!isConnected && (
          <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg shadow-lg">
            <p className="font-medium">Connection lost</p>
            <p className="text-sm">Attempting to reconnect...</p>
          </div>
        )}
      </main>
    </div>
  );
}