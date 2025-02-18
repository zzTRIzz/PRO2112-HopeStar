package com.example.be.core.admin.atribute_management.service.product_detail;

import com.example.be.core.admin.products_management.model.response.ProductImeiResponse;
import com.example.be.entity.Imei;
import com.example.be.core.admin.atribute_management.service.GenericService;

import java.util.List;

public interface ImeiService extends GenericService<Imei,Integer> {
    List<ProductImeiResponse> getImeiByProductDetail(Integer id);
}
