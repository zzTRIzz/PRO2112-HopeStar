package com.example.be.core.admin.banhang.mapper;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.entity.*;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.DeliveryMethodRepository;
import com.example.be.repository.PaymentMethodRepository;
import com.example.be.repository.VoucherRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class BillMapper {
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    VoucherRepository voucherRepository;
    @Autowired
    PaymentMethodRepository paymentMethodRepository;
    @Autowired
    DeliveryMethodRepository deliveryMethodRepository;


    public BillDto dtoBillMapper(Bill bill) {
        return new BillDto(
                bill.getId(),
                bill.getNameBill(),
                (bill.getIdAccount() != null) ? bill.getIdAccount().getId() : null,
                (bill.getIdNhanVien() != null) ? bill.getIdNhanVien().getId() : null,
                (bill.getIdVoucher() != null) ? bill.getIdVoucher().getId() : null,
                bill.getTotalPrice(),
                bill.getCustomerPayment(),
                bill.getAmountChange(),
                bill.getDeliveryFee(),
                bill.getTotalDue(),
                bill.getCustomerRefund(),
                bill.getDiscountedTotal(),
                bill.getDeliveryDate(),
                bill.getCustomerPreferredDate(),
                bill.getCustomerAppointmentDate(),
                bill.getReceiptDate(),
                bill.getPaymentDate(),
                bill.getBillType(),
                bill.getStatus(),
                bill.getAddress(),
                bill.getEmail(),
                bill.getNote(),
                bill.getPhone(),
                bill.getName(),
                bill.getCreatedBy(),
                bill.getUpdatedBy(),
                (bill.getPayment() != null) ? bill.getPayment().getId() : null,
                (bill.getDelivery() != null) ? bill.getDelivery().getId() : null
        );
    }

    public Bill entityBillMapper(BillDto billDto){
        Account accountNhanVien = (billDto.getIdNhanVien() != null)
                ? accountRepository.findById(billDto.getIdNhanVien()).orElse(null)
                : null;

        Account accountKhachHang = (billDto.getIdAccount() != null)
                ? accountRepository.findById(billDto.getIdAccount()).orElse(null)
                : null;

        PaymentMethod paymentMethod = (billDto.getIdPayment() != null)
                ? paymentMethodRepository.findById(billDto.getIdPayment()).orElse(null)
                : null;

        DeliveryMethod deliveryMethod = (billDto.getIdDelivery() != null)
                ? deliveryMethodRepository.findById(billDto.getIdDelivery()).orElse(null)
                : null;

        Voucher voucher = (billDto.getIdVoucher() != null)
                ? voucherRepository.findById(billDto.getIdVoucher()).orElse(null)
                : null;
        return new Bill(
              billDto.getId(),
              billDto.getNameBill(),
              accountKhachHang,
              accountNhanVien,
              voucher,
              billDto.getTotalPrice(),
              billDto.getCustomerPayment(),
              billDto.getAmountChange(),
              billDto.getDeliveryFee(),
              billDto.getTotalDue(),
              billDto.getCustomerRefund(),
              billDto.getDiscountedTotal(),
              billDto.getDeliveryDate(),
              billDto.getCustomerPreferredDate(),
              billDto.getCustomerAppointmentDate(),
              billDto.getReceiptDate(),
              billDto.getPaymentDate(),
              billDto.getBillType(),
              billDto.getStatus(),
              billDto.getAddress(),
              billDto.getEmail(),
              billDto.getNote(),
              billDto.getPhone(),
              billDto.getName(),
              billDto.getCreatedBy(),
              billDto.getUpdatedBy(),
              paymentMethod,
              deliveryMethod
      );
    }



}




