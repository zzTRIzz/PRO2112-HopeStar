import React from 'react';
import dayjs from 'dayjs';
import { Select, Card, Row, Col, Statistic, Spin, DatePicker, Button } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTotalPaidOrders, getStatisticsByDateRange } from './api/statisticsApi';
import { RevenueChart } from './components/revenue-chart';
import { OrderCountChart } from './components/order-count-chart';
import { RevenueByProductChart } from './components/revenue-by-product-chart';
import { BestSellingProductsChart } from './components/best-selling-products-chart';
import { PaidBillsTable } from './components/paid-bills-table';
import { LowStockTable } from './components/low-stock-table';
import { StatsCards } from './components/stats-cards';

export type ViewMode = 'day' | '3days' | '7days' | 'month' | 'year';

export interface DayRevenue {
  date: string;
  totalRevenue: number;
}

export interface MonthRevenue {
  year: number;
  month: number;
  totalRevenue: number; 
}

export interface YearRevenue {
  year: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [viewMode, setViewMode] = React.useState<ViewMode>('month');
  const [dateRange, setDateRange] = React.useState<[string, string] | null>(null);
  const [dateRangeData, setDateRangeData] = React.useState<DateRangeResponse | null>(null);
  const { data: totalOrders, isLoading } = useQuery({
    queryKey: ['total-orders'],
    queryFn: getTotalPaidOrders
  });

  const handleSearch = async () => {
    if (dateRange) {
      const data = await getStatisticsByDateRange(dateRange[0], dateRange[1]);
      setDateRangeData(data);
    }
  };

  // Add handler for viewMode changes
  const handleViewModeChange = (value: ViewMode) => {
    setViewMode(value);
    // Reset date range and data when changing view mode
    setDateRange(null);
    setDateRangeData(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <StatsCards />
      {/* Metrics Section */}
      <Row gutter={16}>
        <Col span={8}>

        </Col>
      </Row>

      {/* View Mode Select */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <DatePicker.RangePicker
            className="w-[300px]"
            onChange={(dates, dateStrings) => setDateRange(dateStrings)}
            value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
          />
          <Button 
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
        <Select
          value={viewMode}
          onChange={handleViewModeChange}  // Change from setViewMode to handleViewModeChange
          style={{ width: 160 }}
          options={[
            { label: 'Ngày', value: 'day' },
            { label: '3 ngày gần đây', value: '3days' },
            { label: '7 ngày gần đây', value: '7days' },
            { label: 'Tháng', value: 'month' },
            { label: 'Năm', value: 'year' },
          ]}
        />
      </div>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Doanh thu theo thời gian">
            <RevenueChart 
              viewMode={viewMode} 
              dateRange={dateRange} 
              dateRangeData={dateRangeData}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Số lượng đơn hàng theo thời gian">
            <OrderCountChart 
              viewMode={viewMode} 
              dateRange={dateRange}
              dateRangeData={dateRangeData}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo sản phẩm">
            <RevenueByProductChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Sản phẩm đã bán ">
            <BestSellingProductsChart />
          </Card>
        </Col>
      </Row>

      <LowStockTable />
    </div>
  );
}
