import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTodayRevenue, getMonthlyRevenue, getMonthlyProductSales } from '../api/statisticsApi';
import { IconCash, IconReceipt, IconChartBar } from '@tabler/icons-react';

export const StatsCards = () => {
  const { data: todayData } = useQuery({
    queryKey: ['today-revenue'],
    queryFn: getTodayRevenue
  });

  const { data: monthlyData } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: getMonthlyRevenue
  });

  const { data: productSales } = useQuery({
    queryKey: ['monthly-product-sales'],
    queryFn: getMonthlyProductSales
  });

  // Calculate total quantity sold this month
  const totalQuantitySold = productSales?.reduce((sum, item) => sum + item.dailyQuantitySold, 0) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-4">
      {/* Today's Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Doanh thu hôm nay
          </CardTitle>
          <IconCash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayData?.todayRevenue?.toLocaleString('vi-VN')}đ
          </div>
          <p className="text-xs text-muted-foreground">
            {todayData?.numberOfBills || 0} đơn hàng
          </p>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Doanh thu trong tháng 
          </CardTitle>
          <IconReceipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monthlyData?.monthlyRevenue?.toLocaleString('vi-VN')}đ
          </div>
          <p className="text-xs text-muted-foreground">
            {monthlyData?.numberOfBills || 0} đơn hàng
          </p>
        </CardContent>
      </Card>

      {/* Monthly Product Sales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sản phẩm bán ra trong tháng 
          </CardTitle>
          <IconChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalQuantitySold} sản phẩm
          </div>

        </CardContent>
      </Card>
    </div>
  );
};
