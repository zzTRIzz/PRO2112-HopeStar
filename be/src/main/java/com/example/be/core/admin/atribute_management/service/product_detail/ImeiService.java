package com.example.be.core.admin.atribute_management.service.product_detail;

import com.example.be.core.admin.atribute_management.dto.request.ImeiRequest;
import com.example.be.core.admin.atribute_management.dto.response.ImeiResponse;
import com.example.be.core.admin.banhang.dto.ImeiDto;
import com.example.be.core.admin.products_management.dto.response.ProductImeiResponse;
import com.example.be.entity.Imei;
import com.example.be.core.admin.atribute_management.service.GenericService;

import java.util.List;

public interface ImeiService extends GenericService<Imei,Integer> {

    List<ImeiResponse> getAllImei();

    List<ProductImeiResponse> getImeiByProductDetail(Integer id);

    List<ImeiDto> getAllImeiChuaBan(Integer id);


    List<ImeiDto> findImeiByIdProDaBan(Integer idProduct, Integer idBillDetail);


    List<ImeiDto> findImeiByIdProductDetail(Integer idProduct, Integer idBillDetail);

    Object updateImei(Integer id, ImeiRequest imeiRequest) throws Exception;
}
