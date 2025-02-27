package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.mapper.BillDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.Imei;
import com.example.be.entity.ImeiSold;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ImeiRepository;
import com.example.be.repository.ImeiSoldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
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
                .orElseThrow(()->new RuntimeException("Bill Detail not found"));

        List<Imei> imeis = imeiRepository.findByIdIn(idImei);
        List<ImeiSold> imeiSoldList = new ArrayList<>();

        for (Imei imei : imeis) {
            ImeiSold imeiSold = new ImeiSold();
            imeiSold.setId_Imei(imei);
            imeiSold.setIdBillDetail(billDetail);
            imeiSoldList.add(imeiSold);
            imei.setStatus(StatusImei.NOT_SOLD);
        }
        imeiSoldRepository.saveAll(imeiSoldList);
        imeiRepository.saveAll(imeis);
        Integer quantity = idImei.size();
        billDetail.setQuantity(idImei.size());
        BigDecimal tongTien =  billDetail.getPrice().multiply(BigDecimal.valueOf(quantity));
        billDetail.setTotalPrice(tongTien);
        Bill bill = billRepository.findById(billDetail.getIdBill().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

        BigDecimal tongTienBill = billDetailService.tongTienBill(bill.getId());
        bill.setTotalPrice(tongTienBill);
        billRepository.save(bill);
        BillDetail saveBillDetail = billDetailRepository.save(billDetail);
         return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
     }

}
