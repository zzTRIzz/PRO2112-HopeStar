package com.example.be.core.admin.voucher.service;


import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.CustomersResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherApplyResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface VoucherService {
    List<VoucherResponse> getAll();

    VoucherResponse add(VoucherRequest request);

    VoucherResponse update(Integer id, VoucherRequest request);

    List<Voucher> findByCode(String code);

    List<VoucherResponse> findByDate(String startTime, String endTime);

    Page<VoucherResponse> phanTrang(Pageable pageable);

    List<VoucherResponse> findByCodeAndDate(String code, String startTime, String endTime);

    boolean isCodeExists(String code);

    boolean isCodeExistsForUpdate(String code, Integer id);

    Map<String, Object> assignVoucherToCustomers(Integer voucherId, List<Integer> customerIds);

    VoucherResponse findById(Integer id);

    List<AccountResponse> getAccountsWithVoucher(Integer voucherId);
    List<VoucherResponse> searchVouchers(
            String keyword,  // Tìm theo code hoặc name
            String startTime,
            String endTime,
            Boolean isPrivate,  // Thêm filter theo loại voucher
            String status      // Thêm filter theo trạng thái
    );
    void updateAllVoucherStatuses();
    List<VoucherApplyResponse> getVoucherApply(Account account);

    List<CustomersResponse> getCustomers(Integer voucherId) throws Exception;
}
