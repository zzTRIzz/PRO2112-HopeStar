import React from 'react';
import { Pie } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { getRevenueByProduct } from '../api/statisticsApi';
import { ProductRevenue } from '../types';

export const RevenueByProductChart = () => {
  const { data: rawData } = useQuery<ProductRevenue[]>({
    queryKey: ['revenue-by-product'],
    queryFn: getRevenueByProduct
  });

  const data = React.useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    
    // Gộp doanh thu các sản phẩm có tên giống nhau
    const groupedData = rawData.reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = {
          name: item.name,
          value: 0,
          percentage: 0
        };
      }
      acc[item.name].value += item.totalRevenue;
      acc[item.name].percentage += item.percentage;
      return acc;
    }, {} as Record<string, {name: string; value: number; percentage: number}>);

    // Chuyển object thành array và sắp xếp theo doanh thu giảm dần
    return Object.values(groupedData).sort((a, b) => b.value - a.value);
  }, [rawData]);

  // Debugging: Log the processed data
  console.log('Processed Chart Data:', data);

  const config = {
    data,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.5,
    legend: {
      position: 'bottom', 
      itemWidth: 300,
      layout: 'horizontal',
      itemName: {
        formatter: (text: string, item: any) => {
          const currentData = data.find(d => d.name === text); // Changed from item.name to text
          if (!currentData) return text;
          
          const value = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(currentData.value);
          
          return `${text} - ${value} (${currentData.percentage.toFixed(2)}%)`; // Hiển thị percentage từ BE
        }
      }
    },
    label: {
      type: 'inner',
      content: ' ', // Empty content to hide labels
    },
    statistic: {
      title: {
        style: {
          fontSize: '16px',
          lineHeight: '1.5',
          color: 'rgba(0,0,0,0.7)'
        },
        content: 'Tổng doanh thu'
      },
      content: {
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'rgba(0,0,0,0.8)'
        },
        content: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(data.reduce((sum, item) => sum + item.value, 0))
      }
    },
    pieStyle: {
      lineWidth: 0,
      shadowColor: 'rgba(0,0,0,0.2)',
      shadowBlur: 10
    },
    interactions: [
      { type: 'element-active' },
      { type: 'pie-statistic-active' }
    ],
    tooltip: {
      title: 'name',
      customItems: (originalItems: any[]) => {
        return originalItems.map(item => ({
          ...item,
          name: 'Thông tin',
          value: `Sản phẩm: ${item.name}\nDoanh thu: ${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(item.value)}\nTỷ lệ: ${item.percentage.toFixed(2)}%`
        }));
      }
    }
  };

  return (
    <div style={{ height: 500 }}>
      <Pie {...config} />
    </div>
  );
};