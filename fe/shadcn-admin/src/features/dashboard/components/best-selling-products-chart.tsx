import React from 'react';
import { Column } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { getBestSellingProducts } from '../api/statisticsApi';
import { BestSellingProduct } from '../types';

export const BestSellingProductsChart = () => {
  const { data: rawData } = useQuery<BestSellingProduct[]>({
    queryKey: ['best-selling'],
    queryFn: getBestSellingProducts
  });

  const data = React.useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    
    // Gộp số lượng các sản phẩm có tên giống nhau
    const groupedData = rawData.reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = {
          name: item.name,
          totalQuantity: 0,
          code: item.code // Giữ lại mã của sản phẩm đầu tiên
        };
      }
      acc[item.name].totalQuantity += item.totalQuantity;
      return acc;
    }, {} as Record<string, {name: string; totalQuantity: number; code: string}>);

    // Chuyển object thành array và sắp xếp theo số lượng giảm dần
    return Object.values(groupedData)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      // Chỉ lấy top 10 sản phẩm bán chạy nhất
      .slice(0, 10);
  }, [rawData]);

  const config = {
    data,
    xField: 'name',
    yField: 'totalQuantity',
    label: {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.8,
        fontSize: 12,
        fontWeight: 500,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false, // Tắt tự động xoay
        style: {
          fontSize: 12,
          fontWeight: 400,
        },
        formatter: (text: string) => {
          // Giới hạn độ dài tên sản phẩm và thêm dấu ... nếu quá dài
          return text.length > 15 ? `${text.substring(0, 15)}...` : text;
        }
      },
      title: {
        text: 'Tên sản phẩm',
        style: {
          fontSize: 14,
          fontWeight: 600,
        },
      },
    },
    yAxis: {
      title: {
        text: 'Số lượng đã bán',
        style: {
          fontSize: 14,
          fontWeight: 600,
        },
      },
      label: {
        formatter: (v: string) => `${Math.floor(Number(v))} sp`, // Thêm Math.floor để chỉ lấy phần nguyên
        style: {
          fontSize: 12,
          fontWeight: 400,
        },
      },
      min: 0, // Đảm bảo trục Y bắt đầu từ 0
      minInterval: 1, // Đảm bảo khoảng cách tối thiểu giữa các điểm là 1
      tickInterval: 1, // Đảm bảo các điểm trên trục cách đều nhau 1 đơn vị
    },
    meta: {
      totalQuantity: {
        alias: 'Số lượng đã bán',
      },
      name: {
        alias: 'Tên sản phẩm',
      },
    },
    columnStyle: {
      radius: [20, 20, 0, 0],
      fill: 'l(270) 0:#1890ff 1:#1890ff',
    },
    tooltip: {
      title: 'name',
      customItems: (originalItems: any[]) => {
        return originalItems.map(item => ({
          ...item,
          name: 'Chi tiết',
          value: `${item.name}\nMã SP: ${item.code}\nĐã bán: ${item.totalQuantity} sản phẩm`
        }));
      }
    }
  };

  return (
    <div style={{ height: 500 }}>
      <Column {...config} />
    </div>
  );
};
