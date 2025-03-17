package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.StatusCartDetail;
import jakarta.persistence.*;
import lombok.*;
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "cart_detail")
public class CartDetail extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product_detail")
    private ProductDetail idProductDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_shopping_cart")
    private ShoppingCart idShoppingCart;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    //@Enumerated(EnumType.STRING)
    private StatusCartDetail status;

}