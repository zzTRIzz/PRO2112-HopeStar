package com.example.be.core.admin.banhang.service;

import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.ImeiSoldDto;

import java.util.List;

public interface ImeiSoldService {
    BillDetailDto creatImeiSold(Integer idBillDetail, List<Integer> idImei);

//    void updateStartusImei(ImeiSoldDto imeiSoldDto);

    //
    BillDetailDto updateImeiSold(Integer idBillDetail, List<Integer> idImei);

    void deleteImeiSold(Integer idBillDetail);
}
