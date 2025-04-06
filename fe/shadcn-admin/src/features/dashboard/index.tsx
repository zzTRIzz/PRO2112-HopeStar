import React from 'react';
import { Select, Card, Row, Col, Statistic, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getTotalPaidOrders } from './api/statisticsApi';
import { RevenueChart } from './components/revenue-chart';
import { OrderCountChart } from './components/order-count-chart';
import { RevenueByProductChart } from './components/revenue-by-product-chart';
import { BestSellingProductsChart } from './components/best-selling-products-chart';
import { PaidBillsTable } from './components/paid-bills-table';
import { LowStockTable } from './components/low-stock-table';
import { StatsCards } from './components/stats-cards';
import type { ViewMode } from './types';

export default function Dashboard() {
  const [viewMode, setViewMode] = React.useState<ViewMode>('month');
  const { data: totalOrders, isLoading } = useQuery({
    queryKey: ['total-orders'],
    queryFn: getTotalPaidOrders
  });

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
      <div className="flex justify-end">
        <Select
          value={viewMode}
          onChange={setViewMode}
          style={{ width: 120 }}
          options={[
            { label: 'Ngày', value: 'day' },
            { label: 'Tháng', value: 'month' },
            { label: 'Năm', value: 'year' },
          ]}
        />
      </div>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Doanh thu theo thời gian">
            <RevenueChart viewMode={viewMode} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Số lượng đơn hàng theo thời gian">
            <OrderCountChart viewMode={viewMode} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo sản phẩm">
            <RevenueByProductChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Sản phẩm bán chạy">
            <BestSellingProductsChart />
          </Card>
        </Col>
      </Row>

      <Card title="Hóa đơn đã thanh toán">
        <PaidBillsTable />
      </Card>

      <LowStockTable />
    </div>
  );
}
