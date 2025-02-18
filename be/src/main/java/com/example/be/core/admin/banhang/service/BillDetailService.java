package com.example.be.core.admin.banhang.service;

import com.example.be.dto.BillDetailDto;
import com.example.be.entity.BillDetail;

import java.math.BigDecimal;
import java.util.List;

public interface BillDetailService {
    List<BillDetailDto> getAllBillDetail();

    List<BillDetail> getALlThuong();

    BillDetailDto createBillDetail(BillDetailDto billDetailDto);

    void thayDoiSoLuongKhiCungSPVaHD(Integer idBill, Integer idProductDetail, Integer SoLuong);

    List<BillDetailDto> getByIdBill(Integer idBill);

    BigDecimal tongTienBill(Integer idBill);
}
