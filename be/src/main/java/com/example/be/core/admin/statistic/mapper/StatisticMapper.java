package com.example.be.core.admin.statistic.mapper;

import com.example.be.core.admin.statistic.dto.response.BillResponse;
import com.example.be.entity.Bill;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StatisticMapper {

    public BillResponse toBillResponse(Bill bill) {
        return new BillResponse(
                bill.getId(),
                bill.getTotalPrice(),
                bill.getStatus().toString(),
                bill.getIdAccount() != null ? bill.getIdAccount().getEmail() : null,
                bill.getIdAccount() != null ? bill.getIdAccount().getPhone() : null,
                bill.getIdAccount() != null ? bill.getIdAccount().getFullName() : null
        );
    }

    public List<BillResponse> toBillResponseList(List<Bill> bills) {
        return bills.stream()
                .map(this::toBillResponse)
                .collect(Collectors.toList());
    }
}
