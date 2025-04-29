package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.StatusBill;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "bill")
public class Bill extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "ma_bill" , unique = true)
    private String maBill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_account")
    private Account idAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nhan_vien")
    private Account idNhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_voucher")
    private Voucher idVoucher;

    @Column(name = "total_price", precision = 24, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "customer_payment", precision = 24, scale = 2)
    private BigDecimal customerPayment;

    @Column(name = "amount_change", precision = 24, scale = 2)
    private BigDecimal amountChange;

    @Column(name = "delivery_fee", precision = 24, scale = 2)
    private BigDecimal deliveryFee;

    @Column(name = "total_due", precision = 24, scale = 2)
    private BigDecimal totalDue;

    @Column(name = "customer_refund", precision = 24, scale = 2)
    private BigDecimal customerRefund;

    @Column(name = "discounted_total", precision = 24, scale = 2)
    private BigDecimal discountedTotal;

    @Column(name = "pay_insurance", precision = 24, scale = 2)
    private BigDecimal payInsurance;

    @Column(name = "receipt_date")
    private LocalDateTime  receiptDate;

    @Column(name = "payment_date")
    private LocalDateTime  paymentDate;

    @Column(name = "bill_type")
    private Byte billType;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusBill status;

    @Size(max = 255)
    @Column(name = "address")
    private String address;

    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Size(max = 1000)
    @Column(name = "note", length = 1000)
    private String note;

    @Size(max = 255)
    @Column(name = "phone")
    private String phone;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @Size(max = 255)
    @Column(name = "created_by")
    private String createdBy;

    @Size(max = 255)
    @Column(name = "updated_by")
    private String updatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private PaymentMethod payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id")
    private DeliveryMethod delivery;

}