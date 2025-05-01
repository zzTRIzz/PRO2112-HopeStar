package com.example.be.core.admin.statistic.service;

import com.example.be.core.admin.statistic.dto.response.*;

import java.time.LocalDate;
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
    List<StatisticByDateResponse> getRevenueLast3Days();
    List<StatisticByDateResponse> getRevenueLast7Days();
    List<OrderCountByDateResponse> getOrderCountLast3Days();
    List<OrderCountByDateResponse> getOrderCountLast7Days();
    StatisticByDateRangeResponse getStatisticByDateRange(LocalDate startDate, LocalDate endDate);
    List<ListCustomerCancelOrderResponse> getCustomersWithCanceledOrders();
    List<RevenueTop10CustomerResponse> getTop10RevenueCustomers();
}
