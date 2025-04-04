package com.example.be.core.admin.voucher.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherAssignRequest {
    private Integer voucherId;
    private List<Integer> customerIds;
}
