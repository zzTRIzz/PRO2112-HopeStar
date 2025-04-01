import React from 'react';
import { Line } from '@ant-design/charts';
import { ViewMode } from '../types';
import { useQuery } from '@tanstack/react-query';
import { getRevenueByDate, getRevenueByMonth, getRevenueByYear } from '../api/statisticsApi';

interface RevenueChartProps {
  viewMode: ViewMode;
}

export const RevenueChart = ({ viewMode }: RevenueChartProps) => {
  const { data: dayData } = useQuery({
    queryKey: ['revenue', 'day'],
    queryFn: getRevenueByDate,
    enabled: viewMode === 'day'
  });

  const { data: monthData } = useQuery({
    queryKey: ['revenue', 'month'], 
    queryFn: getRevenueByMonth,
    enabled: viewMode === 'month'
  });

  const { data: yearData } = useQuery({
    queryKey: ['revenue', 'year'],
    queryFn: getRevenueByYear, 
    enabled: viewMode === 'year'
  });

  const chartData = React.useMemo(() => {
    switch(viewMode) {
      case 'day':
        return dayData?.map(item => ({
          date: item.date,
          value: item.totalRevenue,
          type: 'Doanh thu'
        }));
      case 'month':
        return monthData?.map(item => ({
          date: `${item.month}/${item.year}`,
          value: item.totalRevenue,
          type: 'Doanh thu'  
        }));
      case 'year':
        return yearData?.map(item => ({
          date: item.year.toString(),
          value: item.totalRevenue,
          type: 'Doanh thu'
        }));
      default:
        return [];
    }
  }, [viewMode, dayData, monthData, yearData]);

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
