package com.example.be.controller.admin.statistic;

import com.example.be.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    // Endpoint tính tổng doanh thu
    @GetMapping("/statistics/total-revenue")
    public BigDecimal getTotalRevenue() {
        return statisticService.calculateTotalRevenue();
    }

    // Endpoint tính doanh thu theo phương thức thanh toán
    @GetMapping("/statistics/revenue-by-payment-method")
    public BigDecimal getRevenueByPaymentMethod(String paymentMethod) {
        return statisticService.calculateRevenueByPaymentMethod(paymentMethod);
    }

    // Endpoint tính doanh thu theo năm
    @GetMapping("/statistics/revenue-by-year/{year}")
    public BigDecimal getRevenueByYear(@PathVariable int year) {
        return statisticService.calculateRevenueByYear(year);
    }

    // Endpoint tính doanh thu theo tháng
    @GetMapping("/statistics/revenue-by-month/{year}/{month}")
    public BigDecimal getRevenueByMonth(@PathVariable int year, @PathVariable int month) {
        return statisticService.calculateRevenueByMonth(year, month);
    }

    // Endpoint tính doanh thu theo ngày
    @GetMapping("/statistics/revenue-by-day/{year}/{month}/{day}")
    public BigDecimal getRevenueByDay(@PathVariable int year, @PathVariable int month, @PathVariable int day) {
        return statisticService.calculateRevenueByDay(year, month, day);
    }

    // Endpoint tính tổng số lượng hóa đơn
    @GetMapping("/statistics/total-bill-count")
    public long getTotalBillCount() {
        return statisticService.calculateTotalBillCount();
    }
}
