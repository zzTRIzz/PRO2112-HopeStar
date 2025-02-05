package com.example.be.entity;

import com.example.be.entity.base.AudiEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "shopping_cart")
public class ShoppingCart extends AudiEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_account")
    private Account idAccount;

    @Size(max = 255)
    @Column(name = "code")
    private String code;

    @Column(name = "status")
    private Byte status;

}