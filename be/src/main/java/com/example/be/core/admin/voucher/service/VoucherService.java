package com.example.be.core.admin.voucher.service;



import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Voucher;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getAll();
    VoucherResponse add(VoucherRequest request);
    VoucherResponse update(Integer id, VoucherRequest request);
<<<<<<< HEAD

    void updateSoLuongVoucher(Integer idVoucher);
=======
    List<Voucher> findByCode(String code);
    List<VoucherResponse> findByDate(String startTime,String endTime);
>>>>>>> feature_hieu
}
