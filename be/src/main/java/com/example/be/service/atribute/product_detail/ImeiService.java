package com.example.be.service.atribute.product_detail;

import com.example.be.dto.response.products.ProductImeiResponse;
import com.example.be.entity.Imei;
import com.example.be.service.base.GenericService;

import java.util.List;

public interface ImeiService extends GenericService<Imei,Integer> {
    List<ProductImeiResponse> getImeiByProductDetail(Integer id);
}
