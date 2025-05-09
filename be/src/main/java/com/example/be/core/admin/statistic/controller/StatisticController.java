package com.example.be.core.admin.statistic.controller;

import com.example.be.core.admin.statistic.dto.model.StatisticDateRangeRequest;
import com.example.be.core.admin.statistic.dto.response.*;
import com.example.be.core.admin.statistic.service.StatisticService;
import com.example.be.core.client.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticController {
    private final StatisticService statisticService;

    private final AuthService authService;

    //Hoa don da thanh toan
    @GetMapping("/paid-bills")
    public List<BillResponse> getPaidBills(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getPaidBills();
    }

    //Doanh thu theo ngày
    @GetMapping("/revenue-by-date")
    public List<StatisticByDateResponse> getRevenueByDate(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getRevenueByDate();
    }


    // Doanh thu theo tháng
    @GetMapping("/revenue-by-month")
    public List<RevenueByMonthResponse> getRevenueByMonth(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getRevenueByMonth();
    }

    // Doanh thu theo năm
    @GetMapping("/revenue-by-year")
    public List<RevenueByYearResponse> getRevenueByYear(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getRevenueByYear();
    }

    // Doanh thu theo sản phẩm
    @GetMapping("/revenue-by-product")
    public List<ProductRevenueResponse> getRevenueByProduct(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getRevenueByProduct();
    }

    // Số lượng hóa đơn theo ngày
    @GetMapping("/order-count-by-date")
    public List<OrderCountByDateResponse> getOrderCountByDate(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getOrderCountByDate();
    }

    // Số lượng hóa đơn theo tháng
    @GetMapping("/order-count-by-month")
    public List<OrderCountByMonthResponse> getOrderCountByMonth(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getOrderCountByMonth();
    }

    // Số lượng hóa đơn theo năm
    @GetMapping("/order-count-by-year")
    public List<OrderCountByYearResponse> getOrderCountByYear(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getOrderCountByYear();
    }

    // Tổng số lượng hóa đơn đã thanh toán
    @GetMapping("/total-paid-orders")
    public TotalPaidOrdersResponse getTotalPaidOrders(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getTotalPaidOrders();
    }

    //Sản phẩm bán chạy
    @GetMapping("/best-selling-products")
    public List<BestSellingProductResponse> getBestSellingProducts(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getBestSellingProducts();
    }
    //Doanh thu hôm nay
    @GetMapping("/revenue/today")
    public TodayRevenueResponse getTodayRevenue(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getTodayRevenue();
    }

    // Doanh thu tháng này
    @GetMapping("/revenue/monthly")
    public MonthlyRevenueResponse getMonthlyRevenue(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getMonthlyRevenue();
    }

    //Sản phẩm bán tháng này
    @GetMapping("/monthly-product-sales")
    public List<ProductSalesResponse> getMonthlyProductSales(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getMonthlyProductSales();
    }

    @GetMapping("/low-stock-products")
    public List<LowStockProductResponse> getLowStockProducts(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getLowStockProducts();
    }

    // Trong StatisticController.java

    // Thống kê doanh thu 3 ngày gần nhất
    @GetMapping("/revenue/last-3-days")
    public List<StatisticByDateResponse> getRevenueLast3Days(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getRevenueLast3Days();
    }

    // Thống kê doanh thu 7 ngày gần nhất
    @GetMapping("/revenue/last-7-days")
    public List<StatisticByDateResponse> getRevenueLast7Days(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getRevenueLast7Days();
    }

    @GetMapping("/order-count/last-3-days")
    public List<OrderCountByDateResponse> getOrderCountLast3Days(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getOrderCountLast3Days();
    }

    // Thống kê số lượng hóa đơn 7 ngày gần nhất
    @GetMapping("/order-count/last-7-days")
    public List<OrderCountByDateResponse> getOrderCountLast7Days(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getOrderCountLast7Days();
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<StatisticByDateRangeResponse> getStatisticByDateRange(@RequestHeader(value = "Authorization") String jwt,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) throws Exception {

        StatisticByDateRangeResponse response = statisticService.getStatisticByDateRange(
                startDate,
                endDate
        );
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/canceled-orders")
    public List<ListCustomerCancelOrderResponse> getCustomersWithCanceledOrders(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getCustomersWithCanceledOrders();
    }

    // Top 10 doanh thu
    @GetMapping("/top10-revenue-customers")
    public List<RevenueTop10CustomerResponse> getTop10RevenueCustomers(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        return statisticService.getTop10RevenueCustomers();
    }
}
