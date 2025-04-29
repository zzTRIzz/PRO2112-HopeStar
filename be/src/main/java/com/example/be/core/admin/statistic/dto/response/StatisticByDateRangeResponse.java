package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
public class StatisticByDateRangeResponse {
    private BigDecimal value;
    private Long totalOrders;
    private List<DailyStatistic> dailyStatistics;
}
