package com.example.be.service;

import com.example.be.request.product.VoucherRequest;
import com.example.be.response.VoucherResponse;

import java.util.List;
import java.util.Optional;

public interface VoucherService {
    List<VoucherResponse> getAll();
    VoucherResponse add(VoucherRequest request);
    VoucherResponse update(Integer id, VoucherRequest request);

}
