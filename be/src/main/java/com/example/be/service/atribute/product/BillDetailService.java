package com.example.be.service.atribute.product;

import com.example.be.entity.BillDetail;

import java.util.List;

public interface BillDetailService {
    List<BillDetail> getAllBillDetail();

    void createBillDetail(BillDetail billDetail);
}
