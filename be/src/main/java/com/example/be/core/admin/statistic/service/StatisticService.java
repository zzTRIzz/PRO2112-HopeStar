package com.example.be.core.admin.statistic.service;

import com.example.be.core.admin.statistic.dto.response.*;

import java.util.List;

public interface StatisticService {
    List<BillResponse> getPaidBills();
    List<StatisticByDateResponse> getRevenueByDate();
    List<RevenueByYearResponse> getRevenueByYear();
    List<RevenueByMonthResponse> getRevenueByMonth();
    List<ProductRevenueResponse> getRevenueByProduct();
    List<OrderCountByDateResponse> getOrderCountByDate();
    List<OrderCountByMonthResponse> getOrderCountByMonth();
    List<OrderCountByYearResponse> getOrderCountByYear();
    TotalPaidOrdersResponse getTotalPaidOrders();
    List<BestSellingProductResponse> getBestSellingProducts();
    TodayRevenueResponse getTodayRevenue();
    MonthlyRevenueResponse getMonthlyRevenue();
    List<ProductSalesResponse> getMonthlyProductSales();
    List<LowStockProductResponse> getLowStockProducts();
}
