import React from 'react';
import { Column } from '@ant-design/charts';
import { ViewMode } from '../types';
import { useQuery } from '@tanstack/react-query';
import { getOrderCountByDate, getOrderCountByMonth, getOrderCountByYear, getLast3DaysOrderCount, getLast7DaysOrderCount } from '../api/statisticsApi';
import type { DateRangeResponse } from '../types';

interface OrderCountChartProps {
  viewMode: ViewMode;
  dateRange?: [string, string] | null;
  dateRangeData?: DateRangeResponse | null;
}

export const OrderCountChart = ({ viewMode, dateRange, dateRangeData }: OrderCountChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['orderCount', viewMode],
    queryFn: () => {
      if (dateRange && dateRangeData) {
        return dateRangeData.dailyStatistics;
      }
      
      switch (viewMode) {
        case 'day':
          return getOrderCountByDate();
        case '3days':
          return getLast3DaysOrderCount();
        case '7days':
          return getLast7DaysOrderCount();
        case 'month':
          return getOrderCountByMonth();
        case 'year':
          return getOrderCountByYear();
        default:
          return getOrderCountByMonth();
      }
    },
    enabled: !dateRange || !dateRangeData
  });

  if (isLoading) return <div>Loading...</div>;

  const chartData = dateRangeData 
    ? dateRangeData.dailyStatistics.map(item => ({
        name: new Date(item.date).toLocaleDateString('vi-VN'),
        'Số đơn hàng': item.orderCount  // Change orderCount to 'Số đơn hàng' to match yField
      }))
    : data?.map(item => {
      let name = '';
      if (viewMode === 'day' || viewMode === '3days' || viewMode === '7days') {
        name = formatDate(item.orderDate);
      } else if (viewMode === 'month') {
        name = `${item.orderMonth}/${item.orderYear}`;
      } else {
        name = `${item.orderYear}`;
      }

      return {
        name,
        'Số đơn hàng': item.totalOrders
      };
    });

  const config = {
    data: chartData || [],
    xField: 'name',
    yField: 'Số đơn hàng',
    color: '#2563eb',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return <Column {...config} />;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}
