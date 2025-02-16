package com.example.be.service.atribute.product;

import com.example.be.dto.BillDetailDto;
import com.example.be.entity.BillDetail;

import java.math.BigDecimal;
import java.util.List;

public interface BillDetailService {
    List<BillDetailDto> getAllBillDetail();

    BillDetailDto createBillDetail(BillDetailDto billDetailDto);

    List<BillDetailDto> getByIdBill(Integer idBill);

    BigDecimal tongTienBill(Integer idBill);
}
