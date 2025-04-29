package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.ImeiSoldDto;
import com.example.be.core.admin.banhang.mapper.BillDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.entity.BillDetail;
import com.example.be.entity.Imei;
import com.example.be.entity.ImeiSold;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ImeiRepository;
import com.example.be.repository.ImeiSoldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ImeiSoldServiceImpl implements ImeiSoldService {

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    BillDetailMapper billDetailMapper;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    BillRepository billRepository;

    @Autowired
    ImeiRepository imeiRepository;

    @Autowired
    ImeiSoldRepository imeiSoldRepository;


    @Override
    public BillDetailDto creatImeiSold(Integer idBillDetail, List<Integer> idImei) {
        BillDetail billDetail = billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Bill Detail not found"));

        List<Imei> imeis = imeiRepository.findByIdIn(idImei);
        List<ImeiSold> imeiSoldList = new ArrayList<>();

        for (Imei imei : imeis) {
            ImeiSold imeiSold = new ImeiSold();
            imeiSold.setId_Imei(imei);
            imeiSold.setIdBillDetail(billDetail);
            imeiSoldList.add(imeiSold);
            imei.setStatus(StatusImei.SOLD);
        }
        imeiSoldRepository.saveAll(imeiSoldList);
        imeiRepository.saveAll(imeis);
        BillDetail savebillD = billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Bill Detail not found"));

        BillDetail saveBillDetail = billDetailRepository.save(savebillD);
        return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
    }

    //
    @Override
    public BillDetailDto updateImeiSold(Integer idBillDetail, List<Integer> idImei) {
        BillDetail billDetail = billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Bill Detail not found"));
        List<Imei> listImeis = imeiSoldRepository.searchImeiSold(idBillDetail);
        List<ImeiSold> searchimeiSold = imeiSoldRepository.searchImeiSoldByIdImei(idImei);
        if (searchimeiSold != null) {
            for (Imei imei : listImeis) {
                imei.setStatus(StatusImei.NOT_SOLD);
            }
            imeiRepository.saveAll(listImeis);
            imeiSoldRepository.deleteImeiSold(idBillDetail);
        }
        List<Imei> imeis = imeiRepository.findByIdIn(idImei);
        List<ImeiSold> imeiSoldList = new ArrayList<>();

        for (Imei imei : imeis) {
            ImeiSold imeiSold = new ImeiSold();
            imeiSold.setId_Imei(imei);
            imeiSold.setIdBillDetail(billDetail);
            imeiSoldList.add(imeiSold);
            imei.setStatus(StatusImei.SOLD);
        }
        imeiSoldRepository.saveAll(imeiSoldList);
        imeiRepository.saveAll(imeis);
        BillDetail savebillD = billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Bill Detail not found"));

        BillDetail saveBillDetail = billDetailRepository.save(savebillD);
        return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
    }


    @Override
    public void deleteImeiSold(Integer idBillDetail) {
        List<Imei> imeis = imeiSoldRepository.searchImeiSold(idBillDetail);

        for (Imei imei : imeis) {
            imei.setStatus(StatusImei.NOT_SOLD);
        }
        if (!imeis.isEmpty()) {
            imeiRepository.saveAll(imeis);
        }
        imeiSoldRepository.deleteImeiSold(idBillDetail);
    }


}
