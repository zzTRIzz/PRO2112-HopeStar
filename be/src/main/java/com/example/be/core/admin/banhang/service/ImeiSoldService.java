package com.example.be.core.admin.banhang.service;

import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;

import java.util.List;

public interface ImeiSoldService {

    SearchBillDetailDto creatImeiSold(Integer idBillDetail, List<Integer> idImei);

    SearchBillDetailDto updateImeiSold(Integer idBillDetail, List<Integer> idImei);

    void deleteImeiSold(Integer idBillDetail);
}
