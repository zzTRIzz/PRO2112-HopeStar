package com.example.be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "sale")
public class Sale {
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

    @Column(name = "date_start")
    private Instant dateStart;

    @Column(name = "date_end")
    private Instant dateEnd;

    @Column(name = "status")
    private Byte status;

    @Size(max = 1000)
    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "discount_value")
    private Integer discountValue;

    @Column(name = "discount_type")
    private Boolean discountType;

}