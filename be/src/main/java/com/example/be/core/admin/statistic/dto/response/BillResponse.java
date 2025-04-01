package com.example.be.core.admin.statistic.dto.response;

import com.example.be.entity.status.StatusBill;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillResponse {
    private Integer idBill;
    private BigDecimal totalPrice;
    private String status;
    private String email;
    private String phone;
    private String name;
}
