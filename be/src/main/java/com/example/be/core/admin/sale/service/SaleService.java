package com.example.be.core.admin.sale.service;

import com.example.be.core.admin.sale.dto.request.SaleRequest;
import com.example.be.core.admin.sale.dto.response.SaleResponse;

import java.util.List;

public interface SaleService {
    List<SaleResponse> getAll();
    SaleResponse add(SaleRequest request);
    SaleResponse update(Integer id, SaleRequest request);
    void delete(Integer id);
}
