package com.example.be.core.admin.sale.service;

import com.example.be.core.admin.sale.dto.request.SaleProductAssignRequest;
import com.example.be.core.admin.sale.dto.request.SaleRequest;
import com.example.be.core.admin.sale.dto.response.SaleDetailResponse;
import com.example.be.core.admin.sale.dto.response.SaleResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface SaleService {
    List<SaleResponse> getAll();
    SaleResponse add(SaleRequest request);
    SaleResponse update(Integer id, SaleRequest request);
    List<SaleResponse> searchSales(String code, LocalDateTime dateStart, LocalDateTime dateEnd);
    Map<String, Object> assignProductsToSale(SaleProductAssignRequest request);
    List<SaleDetailResponse> getProductsInSale(Integer saleId);
    void deleteSaleDetails(List<Integer> ids);
}
