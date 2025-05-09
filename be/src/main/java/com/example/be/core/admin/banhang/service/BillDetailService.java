package com.example.be.core.admin.banhang.service;

import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.ProductDetailDto;
import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;
import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;

import java.util.List;

public interface BillDetailService {
//    List<BillDetailDto> getAllBillDetail();
//
//    List<BillDetail> getALlThuong();

    SearchBillDetailDto createBillDetail(BillDetailDto billDetailDto);

    SearchBillDetailDto thayDoiSoLuongKhiCungSPVaHD(Integer idBill, Integer idProductDetail, Integer SoLuong);

    SearchBillDetailDto capNhatImeiCHoOnline(Integer idBill, Integer idProductDetail, Integer SoLuong);

    List<SearchBillDetailDto> getByIdBill(Integer idBill);

    void deleteBillDetail(Integer idBillDetail);

    List<ProductDetailDto> getAllProductDetailDto(SearchProductRequest searchProductRequest);

    ProductDetailDto quetBarCodeCHoProductTheoImei(String barCode);
}
