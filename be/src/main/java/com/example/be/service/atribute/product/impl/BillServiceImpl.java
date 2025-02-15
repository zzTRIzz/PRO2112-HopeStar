package com.example.be.service.atribute.product.impl;

import com.example.be.dto.BillDto;
import com.example.be.entity.Account;
import com.example.be.entity.Bill;
import com.example.be.mapper.BillMapper;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.BillRepository;
import com.example.be.service.atribute.product.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    BillMapper billMapper;

    @Override
    public List<BillDto> getAllBill(){
       List<Bill> bills = billRepository.findAll();
       return bills.stream().map(billMapper ::dtoBillMapper).
               collect(Collectors.toList());
    }

    @Override
    public List<BillDto> listTaiQuay(){
        List<Bill> listHoaDonCTT = new ArrayList<>();
        for (Bill bill: billRepository.findAll()) {
            if (bill.getBillType() == 0){
                listHoaDonCTT.add(bill);
            }
        }
        return listHoaDonCTT.stream().map(billMapper ::dtoBillMapper)
                .collect(Collectors.toList());
    }

    @Override
    public BillDto createHoaDon(BillDto billDto){
        try {
            Account account = accountRepository.findById(billDto.getIdNhanVien())
                    .orElseThrow(()-> new RuntimeException("Khong tim thay nhan vien " +billDto.getIdNhanVien()));

            BillDto newBill = new BillDto();
            Instant now = Instant.now();
            newBill.setBillType((byte) 0);
            newBill.setPaymentDate(now);
            Bill bill = billMapper.entityBillMapper(billDto, null, null,account,null,null,null);
            Bill saveBill= billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        }catch (Exception e){
            e.printStackTrace();
//            return null;
        }
        return null;
    }

    @Override
    public Bill getByIdHoaDon(Integer id){
        return billRepository.findById(id).orElseThrow(()->
            new RuntimeException("Khong tim thay id "+id)
        );
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
