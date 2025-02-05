package com.example.be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "voucher")
public class Voucher {
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
    private Integer discountValue;

    @Column(name = "voucher_type")
    private Boolean voucherType;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "status")
    private Byte status;

}