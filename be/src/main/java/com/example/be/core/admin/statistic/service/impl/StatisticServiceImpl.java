package com.example.be.core.admin.statistic.service.impl;

import com.example.be.core.admin.statistic.dto.response.*;
import com.example.be.core.admin.statistic.mapper.StatisticMapper;
import com.example.be.core.admin.statistic.service.StatisticService;
import com.example.be.entity.Bill;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.StatisticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {
    private final StatisticRepository statisticRepository;
    private final StatisticMapper statisticMapper;

    @Override
    public List<BillResponse> getPaidBills() {
        List<Bill> paidBills = statisticRepository.findByStatus(StatusBill.DA_THANH_TOAN);
        return paidBills.stream().map(statisticMapper::toBillResponse).collect(Collectors.toList());
    }

    @Override
    public List<StatisticByDateResponse> getRevenueByDate() {
        List<Object[]> results = statisticRepository.getRevenueByDate();
        return results.stream()
                .map(result -> new StatisticByDateResponse(
                        (Date) result[0],
                        new BigDecimal(result[1].toString())
                ))
                        .collect(Collectors.toList());
    }

    @Override
    public List<RevenueByYearResponse> getRevenueByYear() {
        List<Object[]> results = statisticRepository.getRevenueByYear();
        return results.stream()
                .map(result -> new RevenueByYearResponse(
                        ((Number) result[0]).intValue(),
                        (BigDecimal) result[1]))
                .collect(Collectors.toList());
    }

    @Override
    public List<RevenueByMonthResponse> getRevenueByMonth() {
        List<Object[]> results = statisticRepository.getRevenueByMonth();
        return results.stream()
                .map(result -> new RevenueByMonthResponse(
                        ((Number) result[0]).intValue(),
                        ((Number) result[1]).intValue(),
                        (BigDecimal) result[2]))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductRevenueResponse> getRevenueByProduct() {
        List<Object[]> results = statisticRepository.getRevenueByProduct();

        // Calculate total revenue
        BigDecimal totalRevenueSum = results.stream()
                .map(result -> (BigDecimal) result[4]) // Assuming total_revenue is at index 4
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Map results to ProductRevenueResponse and calculate percentage
        return results.stream()
                .map(result -> {
                    BigDecimal totalRevenue = (BigDecimal) result[4]; // total_revenue
                    BigDecimal percentage = totalRevenueSum.compareTo(BigDecimal.ZERO) > 0
                            ? totalRevenue.divide(totalRevenueSum, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)) // Calculate percentage
                            : BigDecimal.ZERO; // Avoid division by zero

                    return new ProductRevenueResponse(
                            ((Number) result[0]).intValue(), // product_id
                            (String) result[1],              // code
                            (String) result[2],              // name
                            (String) result[3],              // description
                            totalRevenue,                     // total_revenue
                            percentage                        // percentage
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderCountByDateResponse> getOrderCountByDate() {
        List<Object[]> results = statisticRepository.getOrderCountByDate();
        return results.stream()
                .map(result -> new OrderCountByDateResponse(
                        ((java.sql.Date) result[0]).toString(), // Chuyển đổi java.sql.Date thành String
                        ((Number) result[1]).longValue() // total_orders
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderCountByMonthResponse> getOrderCountByMonth() {
        List<Object[]> results = statisticRepository.getOrderCountByMonth();
        return results.stream()
                .map(result -> new OrderCountByMonthResponse(
                        ((Number) result[0]).intValue(), // order_year
                        ((Number) result[1]).intValue(), // order_month
                        ((Number) result[2]).longValue() // total_orders
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderCountByYearResponse> getOrderCountByYear() {
        List<Object[]> results = statisticRepository.getOrderCountByYear();
        return results.stream()
                .map(result -> new OrderCountByYearResponse(
                        ((Number) result[0]).intValue(), // order_year
                        ((Number) result[1]).longValue() // total_orders
                ))
                .collect(Collectors.toList());
    }

    @Override
    public TotalPaidOrdersResponse getTotalPaidOrders() {
        Long totalPaidOrders = statisticRepository.getTotalPaidOrders();
        return new TotalPaidOrdersResponse(totalPaidOrders);
    }

    @Override
    public List<BestSellingProductResponse> getBestSellingProducts() {
        List<Object[]> results = statisticRepository.getBestSellingProducts();
        return results.stream()
                .map(result -> new BestSellingProductResponse(
                        ((Number) result[0]).longValue(), // product_id
                        (String) result[1],               // code
                        (String) result[2],               // name
                        (String) result[3],               // description
                        ((Number) result[4]).longValue()  // total_quantity
                ))
                .collect(Collectors.toList());
    }
}
