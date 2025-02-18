package com.example.be.core.admin.voucher.service;



import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAll();
    VoucherResponse add(VoucherRequest request);
    VoucherResponse update(Integer id, VoucherRequest request);

}
