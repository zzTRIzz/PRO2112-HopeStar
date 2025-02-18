package com.example.be.service;



import com.example.be.dto.request.products.VoucherRequest;
import com.example.be.dto.response.products.VoucherResponse;

import java.util.List;
import java.util.Optional;

public interface VoucherService {
    List<VoucherResponse> getAll();
    VoucherResponse add(VoucherRequest request);
    VoucherResponse update(Integer id, VoucherRequest request);

}
