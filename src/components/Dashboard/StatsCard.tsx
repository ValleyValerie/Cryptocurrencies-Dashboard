'use client';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}

export default function StatsCard({ title, value, icon, trend, trendLabel }: StatsCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`flex items-center ${
                  isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : isNegative
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {isPositive && (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {isNegative && (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {Math.abs(trend).toFixed(1)}%
                {trendLabel && <span className="ml-1 text-gray-600 dark:text-gray-400">{trendLabel}</span>}
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}