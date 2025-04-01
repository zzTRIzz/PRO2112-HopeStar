import React from 'react';
import { Column } from '@ant-design/charts';
import { ViewMode } from '../types';
import { useQuery } from '@tanstack/react-query';
import { getOrderCountByDate, getOrderCountByMonth, getOrderCountByYear } from '../api/statisticsApi';

interface OrderCountChartProps {
  viewMode: ViewMode;
}

export const OrderCountChart = ({ viewMode }: OrderCountChartProps) => {
  const { data: dayData } = useQuery({
    queryKey: ['orders', 'day'],
    queryFn: getOrderCountByDate,
    enabled: viewMode === 'day'
  });

  const { data: monthData } = useQuery({
    queryKey: ['orders', 'month'],
    queryFn: getOrderCountByMonth,
    enabled: viewMode === 'month'
  });

  const { data: yearData } = useQuery({
    queryKey: ['orders', 'year'],
    queryFn: getOrderCountByYear,
    enabled: viewMode === 'year'
  });

  const chartData = React.useMemo(() => {
    switch(viewMode) {
      case 'day':
        return dayData?.map(item => ({
          time: item.orderDate,
          value: item.totalOrders,
          type: 'Đơn hàng'
        }));
      case 'month': 
        return monthData?.map(item => ({
          time: `${item.orderMonth}/${item.orderYear}`,
          value: item.totalOrders,
          type: 'Đơn hàng'
        }));
      case 'year':
        return yearData?.map(item => ({
          time: item.orderYear.toString(),
          value: item.totalOrders,
          type: 'Đơn hàng'
        }));
      default:
        return [];
    }
  }, [viewMode, dayData, monthData, yearData]);

  const config = {
    data: chartData || [],
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    legend: false,
    columnStyle: {
      radius: [4, 4, 0, 0],
      fill: 'l(270) 0:#1890ff 1:#1890ff',
    },
    label: {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.8,
        fontSize: 12,
      },
      formatter: (item: any) => item.value ? `${item.value}` : ''
    },
    xAxis: {
      label: {
        autoRotate: true,
        style: {
          fontSize: 12,
        }
      },
      title: {
        text: 'Thời gian',
        style: {
          fontSize: 14,
          fontWeight: 600,
        },
      },
    },
    yAxis: {
      title: {
        text: 'Số lượng đơn hàng',
        style: {
          fontSize: 14,
          fontWeight: 600,
        },
      },
      label: {
        style: {
          fontSize: 12,
        }
      },
      tickInterval: 1,
      min: 0,
    },
    tooltip: {
      title: 'date',
      customItems: (originalItems: any[]) => {
        return originalItems.map(item => ({
          ...item,
          name: 'Số đơn hàng',
          value: item.value ? `${item.value} đơn` : '0 đơn'
        }));
      }
    }
  };

  return <Column {...config} />;
};
