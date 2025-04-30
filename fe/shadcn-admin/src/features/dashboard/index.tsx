import React from 'react';
import dayjs from 'dayjs';
import { Select, Card, Row, Col, Statistic, Spin, Button } from 'antd';
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CanceledOrdersTable } from './components/canceled-orders-table';
import { TopRevenueCustomersTable } from './components/top-revenue-customers-table';

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
  const [dateBatDau, setDateBatDau] = React.useState<Date>();
  const [dateKetThuc, setDateKetThuc] = React.useState<Date>();
  const [error, setError] = React.useState<string | null>(null);
  const { data: totalOrders, isLoading } = useQuery({
    queryKey: ['total-orders'],
    queryFn: getTotalPaidOrders
  });

  const handleSearch = async () => {
    if (dateBatDau && dateKetThuc) {
      const startDate = format(dateBatDau, 'yyyy-MM-dd');
      const endDate = format(dateKetThuc, 'yyyy-MM-dd');
      const data = await getStatisticsByDateRange(startDate, endDate);
      setDateRangeData(data);
    }
  };

  const validateDates = () => {
    if (dateBatDau && dateKetThuc && dateBatDau > dateKetThuc) {
      setError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return false;
    }
    setError(null);
    return true;
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
    <div className="flex flex-col gap-4 p-8">
      <StatsCards />
      {/* Metrics Section */}
      <Row gutter={16}>
        <Col span={8}>

        </Col>
      </Row>

      {/* View Mode Select */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Date Pickers */}
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  className="w-[200px] justify-start border-2 border-black hover:bg-black/5"
                  variant="outline"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateBatDau ? format(dateBatDau, 'dd/MM/yyyy') : 'Ngày bắt đầu'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateBatDau}
                  onSelect={setDateBatDau}
                  disabled={(date) =>
                    date > new Date() || (dateKetThuc ? date > dateKetThuc : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  className="w-[200px] justify-start border-2 border-black hover:bg-black/5"
                  variant="outline"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateKetThuc ? format(dateKetThuc, 'dd/MM/yyyy') : 'Ngày kết thúc'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateKetThuc}
                  onSelect={setDateKetThuc}
                  disabled={(date) =>
                    date > new Date() || (dateBatDau ? date < dateBatDau : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button 
              onClick={handleSearch}
              className="flex items-center border-black"
            >
              <SearchOutlined className="mr-2" />
              Tìm kiếm
            </Button>
          </div>
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

      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}

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

      <div className="flex flex-col gap-4">
        <TopRevenueCustomersTable />
        <CanceledOrdersTable />
      </div>
    </div>
  );
}
