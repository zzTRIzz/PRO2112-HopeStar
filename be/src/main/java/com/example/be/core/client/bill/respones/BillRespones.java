package com.example.be.core.client.bill.respones;

import com.example.be.entity.Account;
import com.example.be.entity.DeliveryMethod;
import com.example.be.entity.PaymentMethod;
import com.example.be.entity.Voucher;
import com.example.be.entity.status.StatusBill;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BillRespones {

    private Integer id;

    private String code;

    private String fullNameKh;

    private String fullNameNV;

    private String codeVoucher;

    private BigDecimal totalPrice;

    private BigDecimal customerPayment;

    private BigDecimal amountChange;

    private BigDecimal deliveryFee;

    private BigDecimal totalDue;

    private BigDecimal customerRefund;

    private BigDecimal discountedTotal;

    private LocalDateTime deliveryDate;

    private LocalDateTime  customerPreferredDate;

    private LocalDateTime  customerAppointmentDate;

    private LocalDateTime  receiptDate;

    private LocalDateTime  paymentDate;

    private Byte billType;

    private StatusBill status;

    private String address;

    private String email;

    private String note;

    private String phone;

    private String name;

    private Integer payment;

    private Integer delivery;

    private Integer detailCount; // Số lượng BillDetail

    List<BillDetailRespones> billDetailResponesList;

}
