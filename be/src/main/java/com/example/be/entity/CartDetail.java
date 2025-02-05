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
@Table(name = "cart_detail")
public class CartDetail extends AudiEntity {
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

    @Column(name = "status")
    private Byte status;

}