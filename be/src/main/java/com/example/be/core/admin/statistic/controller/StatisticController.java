package com.example.be.core.admin.statistic.controller;

        import com.example.be.core.admin.statistic.dto.response.*;
        import com.example.be.core.admin.statistic.service.StatisticService;
        import lombok.RequiredArgsConstructor;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticController {
    private final StatisticService statisticService;

    //Hoa don da thanh toan
    @GetMapping("/paid-bills")
    public List<BillResponse> getPaidBills() {
        return statisticService.getPaidBills();
    }

    //Doanh thu theo ngày
    @GetMapping("/revenue-by-date")
    public List<StatisticByDateResponse> getRevenueByDate() {
        return statisticService.getRevenueByDate();
    }


    // Doanh thu theo tháng
    @GetMapping("/revenue-by-month")
    public List<RevenueByMonthResponse> getRevenueByMonth() {
        return statisticService.getRevenueByMonth();
    }

    // Doanh thu theo năm
    @GetMapping("/revenue-by-year")
    public List<RevenueByYearResponse> getRevenueByYear() {
        return statisticService.getRevenueByYear();
    }

    // Doanh thu theo sản phẩm
    @GetMapping("/revenue-by-product")
    public List<ProductRevenueResponse> getRevenueByProduct() {
        return statisticService.getRevenueByProduct();
    }

    // Số lượng hóa đơn theo ngày
    @GetMapping("/order-count-by-date")
    public List<OrderCountByDateResponse> getOrderCountByDate() {
        return statisticService.getOrderCountByDate();
    }

    // Số lượng hóa đơn theo tháng
    @GetMapping("/order-count-by-month")
    public List<OrderCountByMonthResponse> getOrderCountByMonth() {
        return statisticService.getOrderCountByMonth();
    }

    // Số lượng hóa đơn theo năm
    @GetMapping("/order-count-by-year")
    public List<OrderCountByYearResponse> getOrderCountByYear() {
        return statisticService.getOrderCountByYear();
    }

    // Tổng số lượng hóa đơn đã thanh toán
    @GetMapping("/total-paid-orders")
    public TotalPaidOrdersResponse getTotalPaidOrders() {
        return statisticService.getTotalPaidOrders();
    }

    //Sản phẩm bán chạy
    @GetMapping("/best-selling-products")
    public List<BestSellingProductResponse> getBestSellingProducts() {
        return statisticService.getBestSellingProducts();
    }
    //Doanh thu hôm nay
    @GetMapping("/revenue/today")
    public TodayRevenueResponse getTodayRevenue() {
        return statisticService.getTodayRevenue();
    }

    // Doanh thu tháng này
    @GetMapping("/revenue/monthly")
    public MonthlyRevenueResponse getMonthlyRevenue() {
        return statisticService.getMonthlyRevenue();
    }

    //Sản phẩm bán tháng này
    @GetMapping("/monthly-product-sales")
    public List<ProductSalesResponse> getMonthlyProductSales() {
        return statisticService.getMonthlyProductSales();
    }

    @GetMapping("/low-stock-products")
    public List<LowStockProductResponse> getLowStockProducts() {
        return statisticService.getLowStockProducts();
    }

}
