import React from 'react';
import { Line } from '@ant-design/charts';
import { ViewMode } from '../types';
import { useQuery } from '@tanstack/react-query';
import { 
  getRevenueByDate, 
  getRevenueByMonth, 
  getRevenueByYear, 
  getLast3DaysRevenue,
  getLast7DaysRevenue 
} from '../api/statisticsApi';
import type { DateRangeResponse } from '../types';

interface RevenueChartProps {
  viewMode: ViewMode;
  dateRange?: [string, string] | null;
  dateRangeData?: DateRangeResponse | null;
}

export const RevenueChart = ({ viewMode, dateRange, dateRangeData }: RevenueChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['revenue', viewMode, dateRange],
    queryFn: () => {
      if (dateRange && dateRangeData) {
        return dateRangeData.dailyStatistics;
      }

      switch (viewMode) {
        case 'day':
          return getRevenueByDate();
        case '3days':
          return getLast3DaysRevenue();
        case '7days':
          return getLast7DaysRevenue();
        case 'month':
          return getRevenueByMonth();
        case 'year':
          return getRevenueByYear();
        default:
          return getRevenueByMonth();
      }
    },
    enabled: !dateRange || !dateRangeData
  });

  const chartData = React.useMemo(() => {
    const rawData = dateRangeData?.dailyStatistics || data || [];
    
    return rawData.map((item: any) => ({
      date: item.date ? formatDate(item.date) : 
            item.month ? `${item.month}/${item.year}` : 
            item.year ? `${item.year}` : '',
      value: item.value || 0,
      type: 'Doanh thu'
    }));
  }, [data, dateRangeData, viewMode]);

  const config = {
    data: chartData || [],
    padding: 'auto',
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    yAxis: {
      label: {
        formatter: (value: number) => {
          return `${(value / 1000000).toFixed(1)}M`;
        },
      },
    },
    tooltip: {
      title: 'date',
      customItems: (originalItems: any[]) => {
        return originalItems.map(item => ({
          ...item,
          name: 'Doanh thu',
          value: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(item.value)
        }));
      }
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return <Line {...config} />;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}