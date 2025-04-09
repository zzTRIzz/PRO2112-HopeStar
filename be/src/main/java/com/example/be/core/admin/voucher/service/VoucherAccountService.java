package com.example.be.core.admin.voucher.service;

import com.example.be.core.admin.voucher.dto.model.VoucherAccountDTO;
import com.example.be.entity.status.VoucherAccountStatus;

import java.util.List;

public interface VoucherAccountService {
    VoucherAccountDTO getVoucherAccountById(Integer id);

    VoucherAccountDTO updateStatus(Integer id, VoucherAccountStatus status);

    VoucherAccountDTO getVoucherAccountStatus(Integer voucherId, Integer accountId);

    List<VoucherAccountDTO> getVoucherAccountsByVoucherId(Integer voucherId);

    List<VoucherAccountDTO> getVoucherAccountsByAccountId(Integer accountId);

    void deleteVoucherAccount(Integer id);
    List<VoucherAccountDTO> getVoucherUsageStatuses(Integer voucherId);
}
