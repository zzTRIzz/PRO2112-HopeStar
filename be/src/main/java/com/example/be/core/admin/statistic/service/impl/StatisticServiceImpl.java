package com.example.be.core.admin.statistic.service.impl;

import com.example.be.core.admin.statistic.dto.response.*;
import com.example.be.core.admin.statistic.mapper.StatisticMapper;
import com.example.be.core.admin.statistic.service.StatisticService;
import com.example.be.entity.Bill;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.StatisticRepository;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {
    private final StatisticRepository statisticRepository;
    private final StatisticMapper statisticMapper;

    @Override
    public List<BillResponse> getPaidBills() {
        List<Bill> paidBills = statisticRepository.findByStatus(StatusBill.HOAN_THANH);
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


    public TodayRevenueResponse getTodayRevenue() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        Tuple result = statisticRepository.getRevenueAndCount(startOfDay, endOfDay);

        // Xử lý revenue
        BigDecimal revenue = Optional.ofNullable(result.get(0, BigDecimal.class))
                .orElse(BigDecimal.ZERO);

        // Xử lý count
        Long count = Optional.ofNullable(result.get(1, Long.class))
                .orElse(0L);

        return new TodayRevenueResponse(revenue, count);
    }

    public MonthlyRevenueResponse getMonthlyRevenue() {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX);

        Tuple result = statisticRepository.getRevenueAndCount(startOfMonth, endOfMonth);

        BigDecimal revenue = Optional.ofNullable(result.get(0, BigDecimal.class))
                .orElse(BigDecimal.ZERO);
        Long count = Optional.ofNullable(result.get(1, Long.class))
                .orElse(0L);

        return new MonthlyRevenueResponse(revenue, count);
    }

    @Override
    public List<ProductSalesResponse> getMonthlyProductSales() {
        List<Object[]> results = statisticRepository.getMonthlyProductSales();
        return results.stream()
                .map(result -> new ProductSalesResponse(
                        (Date) result[0], // sale_date
                        ((Number) result[1]).intValue() // daily_quantity_sold
                ))
                .collect(Collectors.toList());
    }

    public List<LowStockProductResponse> getLowStockProducts() {
        List<Object[]> results = statisticRepository.findLowStockProducts();

        return results.stream()
                .map(this::mapToLowStockResponse)
                .collect(Collectors.toList());
    }

    private LowStockProductResponse mapToLowStockResponse(Object[] row) {
        return new LowStockProductResponse(
                (String) row[0],   // product_detail_code (maSP)
                (String) row[1],   // product_name (tenSP)
                (String) row[2],   // color_name (mauSac)
                ((Number) row[3]).intValue(), // inventory_quantity (soLuong)
                (String) row[4],   // status (trangThai)
                (String) row[5]    // image_url (imageUrl) - Thêm dòng này
        );
    }

    public List<StatisticByDateResponse> getRevenueLast3Days() {
        List<Object[]> results = statisticRepository.getRevenueLast3Days();
        return results.stream()
                .map(this::mapToStatisticByDateResponse)
                .collect(Collectors.toList());
    }

    public List<StatisticByDateResponse> getRevenueLast7Days() {
        List<Object[]> results = statisticRepository.getRevenueLast7Days();
        return results.stream()
                .map(this::mapToStatisticByDateResponse)
                .collect(Collectors.toList());
    }

    private StatisticByDateResponse mapToStatisticByDateResponse(Object[] result) {
        Date date = (Date) result[0];
        BigDecimal totalRevenue = (BigDecimal) result[1];
        return new StatisticByDateResponse(date, totalRevenue);
    }

    @Override
    public List<OrderCountByDateResponse> getOrderCountLast3Days() {
        List<Object[]> results = statisticRepository.getOrderCountLast3Days();
        return results.stream()
                .map(result -> new OrderCountByDateResponse(
                        ((java.sql.Date) result[0]).toString(),
                        ((Number) result[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderCountByDateResponse> getOrderCountLast7Days() {
        List<Object[]> results = statisticRepository.getOrderCountLast7Days();
        return results.stream()
                .map(result -> new OrderCountByDateResponse(
                        ((java.sql.Date) result[0]).toString(),
                        ((Number) result[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public StatisticByDateRangeResponse getStatisticByDateRange(LocalDate startDate, LocalDate endDate) {
        // Validate date range
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        List<Object[]> results = statisticRepository.getDailyStatisticByDateRange(startDate, endDate);

        BigDecimal totalRevenue = BigDecimal.ZERO;
        Long totalOrders = 0L;
        List<DailyStatistic> dailyStatistics = new ArrayList<>();

        for (Object[] result : results) {
            Date date = (Date) result[0];
            BigDecimal dailyRevenue = (BigDecimal) result[1];
            Long dailyOrderCount = ((Number) result[2]).longValue();

            totalRevenue = totalRevenue.add(dailyRevenue);
            totalOrders += dailyOrderCount;

            dailyStatistics.add(new DailyStatistic(
                    date.toString(),
                    dailyRevenue,
                    dailyOrderCount
            ));
        }

        return new StatisticByDateRangeResponse(totalRevenue, totalOrders, dailyStatistics);
    }

    @Override
    public List<ListCustomerCancelOrderResponse> getCustomersWithCanceledOrders() {
        List<Object[]> results = statisticRepository.findCustomersWithCanceledOrders();
        return results.stream()
                .map(this::mapToCancelOrderResponse)
                .collect(Collectors.toList());
    }

    private ListCustomerCancelOrderResponse mapToCancelOrderResponse(Object[] row) {
        return new ListCustomerCancelOrderResponse(
                ((Number) row[0]).longValue(),    // customerId
                (String) row[1],                  // customerName
                (String) row[2],                  // email
                (String) row[3],                  // phone
                (String) row[4],                  // address
                (String) row[5],                  // billCode
                (String) row[6]                   // billStatus
        );
    }

    @Override
    public List<RevenueTop10CustomerResponse> getTop10RevenueCustomers() {
        List<Object[]> results = statisticRepository.findTop10RevenueCustomers();
        return results.stream()
                .map(this::mapToRevenueResponse)
                .collect(Collectors.toList());
    }

    private RevenueTop10CustomerResponse mapToRevenueResponse(Object[] row) {
        return new RevenueTop10CustomerResponse(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                (String) row[3],
                new BigDecimal(row[4].toString())
        );
    }
}
