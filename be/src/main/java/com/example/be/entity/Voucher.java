package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.StatusVoucher;
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
@Table(name = "voucher")
public class Voucher extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "code")
    private String code;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @Column(name = "condition_price_min", precision = 24, scale = 2)
    private BigDecimal conditionPriceMin;

    @Column(name = "condition_price_max", precision = 24, scale = 2)
    private BigDecimal conditionPriceMax;

    @Column(name = "discount_value")
    private BigDecimal discountValue;

    @Column(name = "max_discount_amount", precision = 24, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(name = "voucher_type")
    private Boolean voucherType;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "status", length = 20)
    @Enumerated(EnumType.STRING)
    private StatusVoucher status;
    @Column(name = "moTa")
    @Size(max = 1000)
    private String moTa;

    @Column(name = "is_private")
    private Boolean isPrivate = false;
}