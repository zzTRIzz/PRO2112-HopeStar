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

    private String maBill;

    private String fullNameKh;

    private String fullNameNV;

    private String codeVoucher;

    private BigDecimal totalPrice; //tong tien bill-detail

    private BigDecimal customerPayment; //khach tra :nhan hang =0

    private BigDecimal amountChange; //-tong tien da tinh toan

    private BigDecimal deliveryFee; // tien ship

    private BigDecimal totalDue; // tong gia da tinh toan

    private BigDecimal customerRefund; //

    private BigDecimal discountedTotal; // tien giam

    private BigDecimal payInsurance;

    private LocalDateTime  receiptDate;

    private LocalDateTime  paymentDate;

    private Byte billType; // 1:web, 0:quay

    private StatusBill status;

    private String address;

    private String email;

    private String note;

    private String phone;

    private String name;

    private Integer payment; //phuong thuc 1->4

    private Integer delivery; //hinh thuc 1->2: 1nhan quay, 2 ship;

    private Integer detailCount;

    List<BillDetailRespones> billDetailResponesList;

}
