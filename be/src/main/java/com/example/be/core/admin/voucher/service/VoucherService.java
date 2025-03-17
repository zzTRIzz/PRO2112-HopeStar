package com.example.be.core.admin.voucher.service;


import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAll();

    VoucherResponse add(VoucherRequest request);

    VoucherResponse update(Integer id, VoucherRequest request);

    List<Voucher> findByCode(String code);

    List<VoucherResponse> findByDate(String startTime, String endTime);

    Page<VoucherResponse> phanTrang(Pageable pageable);

    List<VoucherResponse> findByCodeAndDate(String code, String startTime, String endTime);
}
