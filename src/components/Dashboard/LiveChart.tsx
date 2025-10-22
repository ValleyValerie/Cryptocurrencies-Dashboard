'use client';

import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/lib/types';

interface LiveChartProps {
  data: ChartDataPoint[];
  title: string;
  chartType?: 'line' | 'bar' | 'area';
}

export default function LiveChart({ data, title, chartType = 'line' }: LiveChartProps) {
  const commonProps = {
    data,
    margin: { top: 5, right: 20, left: 0, bottom: 5 },
  };

  const xAxisProps = {
    dataKey: 'timestamp',
    stroke: '#9CA3AF',
    tick: { fill: '#9CA3AF' },
    tickFormatter: (value: string) => {
      const date = new Date(value);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
  };

  const yAxisProps = {
    stroke: '#9CA3AF',
    tick: { fill: '#9CA3AF' },
  };

  const tooltipProps = {
    contentStyle: {
      backgroundColor: '#1F2937',
      border: '1px solid #374151',
      borderRadius: '0.5rem',
      color: '#F3F4F6',
    },
    labelFormatter: (value: string) => {
      const date = new Date(value);
      return date.toLocaleTimeString();
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              animationDuration={300}
            />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={300}
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={300}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}