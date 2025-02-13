package com.example.be.service.atribute.product.impl;

import com.example.be.entity.Bill;
import com.example.be.repository.BillRepository;
import com.example.be.service.atribute.product.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {
    
//trang thai hóa đơn
//    0 chờ thanh toán
//    1 chờ xác nhận
//    2 đã lấy hàng
//    3 đã giao
//    4 đã thanh toán
//    5 hoàn thành
//    6 đã hủy


    @Autowired
    BillRepository billRepository;

    @Override
    public List<Bill> getAllBill(){
        return billRepository.findAll();
    }

    @Override
    public List<Bill> listTaiQuay(){
        List<Bill> listHoaDonCTT = new ArrayList<>();
        for (Bill bill:getAllBill()) {
            if (bill.getBillType() == 0){
                listHoaDonCTT.add(bill);
            }
        }
        return listHoaDonCTT;
    }

    @Override
    public void createHoaDon(Bill bill){
        try {
            Bill newBill = new Bill();
            Instant now = Instant.now();
            newBill.setIdNhanVien(bill.getIdAccount());
            newBill.setBillType((byte) 0);
            newBill.setPaymentDate(now);
            billRepository.save(newBill);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

     @Override
    public void updateHuyHoaDon(Integer idBill){
        try {
            Bill bill = billRepository.findById(idBill).orElseThrow(
                    ()-> new RuntimeException("Bill not found with id:" +idBill)
            );
            bill.setBillType((byte) 6);
            billRepository.save(bill);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


}
