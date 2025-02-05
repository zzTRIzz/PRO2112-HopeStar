package com.example.be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "delivery_method")
public class DeliveryMethod {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "delivery_type")
    private Byte deliveryType;

}