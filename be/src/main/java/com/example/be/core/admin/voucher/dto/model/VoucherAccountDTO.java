package com.example.be.core.admin.voucher.dto.model;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.status.VoucherAccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherAccountDTO {
    private Integer id;
    private VoucherResponse voucher;
    private AccountResponse account;
    private VoucherAccountStatus status;
    private LocalDateTime usedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
