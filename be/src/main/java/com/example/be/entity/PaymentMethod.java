package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "payment_method")
public class PaymentMethod extends AuditEntity {
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