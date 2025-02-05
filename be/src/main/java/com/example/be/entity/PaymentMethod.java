package com.example.be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "payment_method")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "method")
    private Byte method;

    @Column(name = "type")
    private Byte type;

    @Column(name = "payment_amount", precision = 24, scale = 2)
    private BigDecimal paymentAmount;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private Byte status;

}