package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;
import com.example.be.core.admin.banhang.mapper.SearchBillDetailMapper;
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
    SearchBillDetailMapper searchBillDetailMapper;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    BillRepository billRepository;

    @Autowired
    ImeiRepository imeiRepository;

    @Autowired
    ImeiSoldRepository imeiSoldRepository;


    @Override
    public SearchBillDetailDto creatImeiSold(Integer idBillDetail, List<Integer> idImei) {
        BillDetail billDetail = billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Bill Detail not found"));

        List<Imei> imeis = imeiRepository.findByIdIn(idImei);
        List<Imei> imeisDaBan = imeiRepository.findImeiSoldInOtherBillDetails(idImei, idBillDetail);

        List<String> imeiBiBan = imeisDaBan.stream()
                .filter(imei -> imei.getStatus() != StatusImei.NOT_SOLD)
                .map(Imei::getImeiCode)
                .toList();

        if (!imeiBiBan.isEmpty()) {
            String message = "Imei đã bán: " + String.join(", ", imeiBiBan);
            throw  new RuntimeException(message);
        }

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
        return searchBillDetailMapper.dtoBillDetailMapper(saveBillDetail);
    }

    //
    @Override
    public SearchBillDetailDto updateImeiSold(Integer idBillDetail, List<Integer> idImei) {
        BillDetail billDetail = billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Bill Detail not found"));
        List<Imei> imeisDaBan = imeiRepository.findImeiSoldInOtherBillDetails(idImei, idBillDetail);

        List<String> imeiBiBan = imeisDaBan.stream()
                .filter(imei -> imei.getStatus() != StatusImei.NOT_SOLD)
                .map(Imei::getImeiCode)
                .toList();

        if (!imeiBiBan.isEmpty()) {
            String message = "Imei đã bán: " + String.join(", ", imeiBiBan);
            throw  new RuntimeException(message);
        }

        List<Imei> listImeis = imeiSoldRepository.searchImeiSold(idBillDetail);

        List<ImeiSold> searchimeiSold = imeiSoldRepository.searchImeiSoldByIdImei(idImei);
        if (searchimeiSold != null) {
            for (Imei imei : listImeis) {
                imei.setStatus(StatusImei.NOT_SOLD);
            }
            imeiRepository.saveAll(listImeis);
            imeiSoldRepository.deleteImeiSold(idBillDetail);
        }

        List<ImeiSold> imeiSoldList = new ArrayList<>();
        List<Imei> imeis = imeiRepository.findByIdIn(idImei);

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
        return searchBillDetailMapper.dtoBillDetailMapper(saveBillDetail);
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
