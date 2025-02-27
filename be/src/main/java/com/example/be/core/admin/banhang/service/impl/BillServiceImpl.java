package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.entity.*;
import com.example.be.entity.status.StatusBill;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class BillServiceImpl implements BillService {

//loại trạng thái bán hàng
//    0 là bán hàng tại quầy
//    1 là bán hàng trên web



    @Autowired
    BillRepository billRepository;

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    BillMapper billMapper;

    @Autowired
    VoucherService voucherService;

    @Autowired
    VoucherRepository voucherRepository;

    @Autowired
    PaymentMethodRepository paymentMethodRepository;

    @Autowired
    DeliveryMethodRepository deliveryMethodRepository;


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
            if (bill.getStatus().equals(StatusBill.CHO_THANH_TOAN)){
                listHoaDonCTT.add(bill);
            }
        }
        return listHoaDonCTT.stream().map(billMapper ::dtoBillMapper)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBill(Integer idBill){
        List<BillDetail> billDetail = billDetailRepository.findByIdBill(idBill);

        if (billDetail == null){
            billRepository.deleteById(idBill);
        }else {
            billDetailRepository.deleteByIDBill(idBill);
            billRepository.deleteById(idBill);
        }
    }

    @Override
    public BillDto createHoaDonTaiQuay(BillDto billDto){
        try {
            Account account = accountRepository.findById(billDto.getIdNhanVien())
                    .orElseThrow(()-> new RuntimeException("Khong tim thay nhan vien " +billDto.getIdNhanVien()));

//            BillDto newBill = new BillDto();
            Instant now = Instant.now();
            billDto.setBillType((byte) 0);
            billDto.setStatus(StatusBill.CHO_THANH_TOAN);
            billDto.setPaymentDate(now);
            Bill bill = billMapper.entityBillMapper(billDto,  null,account,null,null,null);
            Bill saveBill= billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public BillDto updateHoaDonTaiQuay(BillDto billDto){
        try {

            Account accountNhanVien = accountRepository.findById(billDto.getIdNhanVien()).orElse(null);

            Account accountKhachHang = accountRepository.findById(billDto.getIdAccount()).orElse(null);

            Voucher voucher;
//            if (accountKhachHang.getId() == null){
//                throw new RuntimeException("Khach hang khon duoc null");
//            }
//            else {
//                 voucher  =voucherRepository.findById(billDto.getIdVoucher()).orElse(null);
            List<Voucher>  voucherList = voucherRepository.giamGiaTotNhat(accountKhachHang.getId(), StatusVoucher.ACTIVE);
            voucher = voucherList.isEmpty() ? null : voucherList.get(0);
//            }
            BigDecimal tongSauKhiGiam;

            if (voucher == null){
                tongSauKhiGiam = billDto.getTotalPrice();
                voucher = null;
            }else if (voucher.getDiscountValue().compareTo(billDto.getTotalPrice()) < 0) {
                tongSauKhiGiam= billDto.getTotalPrice().subtract(voucher.getDiscountValue());
            } else {
                tongSauKhiGiam = BigDecimal.ZERO;
            }
            if (voucher != null){
                voucherService.updateSoLuongVoucher(voucher.getId());
            }
            billDto.setTotalDue(tongSauKhiGiam);
            PaymentMethod paymentMethod;
            if (billDto.getIdPayment() == null){
                paymentMethod = null;
            }else {
                paymentMethod = paymentMethodRepository.findById(billDto.getIdPayment()).orElse(null);
            }

            DeliveryMethod deliveryMethod;
            if (billDto.getIdDelivery() == null){
                deliveryMethod = null;
            }else {
                deliveryMethod = deliveryMethodRepository.findById(billDto.getIdDelivery()).orElse(null);
            }


            Bill bill = billMapper.entityBillMapper(billDto,  accountKhachHang,accountNhanVien,voucher,paymentMethod,deliveryMethod);
            Bill saveBill= billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public BillDto updateTongTienHoaDon(BillDto billDto){
        try {

            Account accountNhanVien = accountRepository.findById(billDto.getIdNhanVien())
                    .orElseThrow(()-> new RuntimeException("Khong tim thay nhan vien " +billDto.getIdNhanVien()));

            Bill bill = billMapper.entityBillMapper(billDto,  null,accountNhanVien,null,null,null);

            Bill saveBill= billRepository.save(bill);

            return billMapper.dtoBillMapper(saveBill);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }


    @Override
    public BillDto getByIdHoaDon(Integer id){
        Bill bill = billRepository.findById(id).orElseThrow(()->
                new RuntimeException("Khong tim thay id "+id)
        );
        return billMapper.dtoBillMapper(bill);
    }

    @Override
    public void updateHuyHoaDon(Integer idBill){
        try {
            Bill bill = billRepository.findById(idBill).orElseThrow(
                    ()-> new RuntimeException("Bill not found with id:" +idBill)
            );
            bill.setStatus(StatusBill.DA_HUY);
            billRepository.save(bill);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    //__________________________________________________________________________________________
    @Override
    public BillDto createHoaDonTaiWeb(BillDto billDto){
        try {
            Account account = accountRepository.findById(billDto.getIdNhanVien())
                    .orElseThrow(()-> new RuntimeException("Khong tim thay nhan vien " +billDto.getIdNhanVien()));

//            BillDto newBill = new BillDto();
            Instant now = Instant.now();
            billDto.setBillType((byte) 1);
            billDto.setStatus(StatusBill.CHO_THANH_TOAN);
            billDto.setPaymentDate(now);
            Bill bill = billMapper.entityBillMapper(billDto,  null,account,null,null,null);
            Bill saveBill= billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }


    @Override
    public void apDungVoucherChoOnline(Bill bill){
        try {
            Account accountKhachHang = accountRepository.findById(bill.getIdAccount().getId()).orElse(null);
//            System.out.println("id khahcs hang "+bill.getIdAccount().getId());
            Voucher voucher;
            List<Voucher>  voucherList = voucherRepository.giamGiaTotNhat(accountKhachHang.getId(),StatusVoucher.ACTIVE);
            voucher = voucherList.isEmpty() ? null : voucherList.get(0);
            BigDecimal tongSauKhiGiam;
            if (voucher == null){
                tongSauKhiGiam = bill.getTotalPrice();
                voucher = null;
            }else if (voucher.getDiscountValue().compareTo(bill.getTotalPrice()) < 0) {
                tongSauKhiGiam= bill.getTotalPrice().subtract(voucher.getDiscountValue());
                voucherService.updateSoLuongVoucher(voucher.getId());
            } else {
                tongSauKhiGiam = BigDecimal.ZERO;
                voucherService.updateSoLuongVoucher(voucher.getId());
            }
            System.out.println("voucher da tim duoc la :"+voucher);
            bill.setIdVoucher(voucher);
            bill.setTotalDue(tongSauKhiGiam);
            billRepository.save(bill);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    @Override
    public BillDto createDatHangOnline(BillDto billDto){
        try {
//            Account account = accountRepository.findById(billDto.getIdNhanVien())
//                    .orElseThrow(()-> new RuntimeException("Khong tim thay nhan vien " +billDto.getIdNhanVien()));
           billDto.setStatus(StatusBill.CHO_XAC_NHAN);
            Bill bill = billMapper.entityBillMapper(billDto,  null,null,null,null,null);
            Bill saveBill= billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

}

