'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type TimeRange = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

interface DataPoint {
  time: string;
  value: number;
}

export default function DashboardChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('hourly');
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    setData(generateData(timeRange));
  }, [timeRange]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Bitcoin price ({timeRange})
        </h2>
        <div className="flex flex-wrap gap-2">
          {['hourly', 'daily', 'weekly', 'monthly', 'yearly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as TimeRange)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `${value}K`} label={{ value: 'Value (thousands)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- Helper Functions ---

function generateData(timeRange: TimeRange): DataPoint[] {
  const now = new Date();
  const data: DataPoint[] = [];

  switch (timeRange) {
    case 'hourly':
      // 24 points (hours)
      for (let i = 0; i < 24; i++) {
        const date = new Date(now);
        date.setHours(now.getHours() - (23 - i));
        data.push({
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: randomValue(50, 150),
        });
      }
      break;

    case 'daily':
      // Last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - (29 - i));
        data.push({
          time: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          value: randomValue(100, 300),
        });
      }
      break;

    case 'weekly':
      // Last 12 weeks
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - (11 - i) * 7);
        const weekNumber = getWeekNumber(date);
        data.push({
          time: `W${weekNumber}`,
          value: randomValue(200, 600),
        });
      }
      break;

    case 'monthly':
      // Last 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - (11 - i));
        data.push({
          time: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
          value: randomValue(400, 900),
        });
      }
      break;

    case 'yearly':
      // Last 5 years
      for (let i = 0; i < 10; i++) {
        const year = now.getFullYear() - (9 - i);
        data.push({
          time: year.toString(),
          value: randomValue(800, 1500),
        });
      }
      break;
  }

  return data;
}

function randomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
