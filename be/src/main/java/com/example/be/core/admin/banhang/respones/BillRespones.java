package com.example.be.core.admin.banhang.respones;

import com.example.be.entity.status.StatusBill;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BillRespones {

    private Integer id;

    private String code;

    private String maBill;

    private Integer idAccount;

    private Integer idNhanVien;

    private String fullNameNV;

    private Integer idVoucher;

    private String codeVoucher;

    private BigDecimal totalPrice;

    private BigDecimal customerPayment;

    private BigDecimal amountChange;

    private BigDecimal deliveryFee;

    private BigDecimal totalDue;

    private BigDecimal customerRefund;

    private BigDecimal discountedTotal;

    private BigDecimal payInsurance;

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

    private Integer detailCount;

    List<BillDetailRespones> billDetailResponesList;

    List<BillHistoryRespones> billHistoryRespones;
}
