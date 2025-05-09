package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ListCustomerCancelOrderResponse {
    private Long customerId;
    private String customerName;
    private String email;
    private String phone;
    private String address;
    private String billCode;
    private String billStatus;
}
