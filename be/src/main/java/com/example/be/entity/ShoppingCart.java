package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
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
public class ShoppingCart extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "id_account", unique = true,nullable = true)
    private Account idAccount;

    @Size(max = 255)
    @Column(name = "code")
    private String code;

    @Column(name = "guest_id", unique = true) // Lưu guest_cart_id từ cookie
    private String guestId;

    @Column(name = "status")
    //@Enumerated(EnumType.STRING)
    private String status;

}