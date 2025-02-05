package com.example.be.entity;

import com.example.be.entity.base.AudiEntity;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "delivery_method")
public class DeliveryMethod extends AudiEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "delivery_type")
    private Byte deliveryType;

}