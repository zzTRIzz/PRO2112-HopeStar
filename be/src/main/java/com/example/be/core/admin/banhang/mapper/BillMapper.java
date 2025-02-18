package com.example.be.core.admin.banhang.mapper;

import com.example.be.dto.BillDto;
import com.example.be.entity.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class BillMapper {


    public BillDto dtoBillMapper(Bill bill) {
        return new BillDto(
                bill.getId(),
                (bill.getIdCart() != null) ? bill.getIdCart().getId() : null,
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

    public Bill entityBillMapper(BillDto billDto, ShoppingCart shoppingCart,
                                 Account accountKhachHang,Account accountNhanVien,
                                 Voucher voucher, PaymentMethod paymentMethod,
                                 DeliveryMethod deliveryMethod){
      return new Bill(
              billDto.getId(),
              shoppingCart,
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




