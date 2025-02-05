package com.example.be.entity;

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
@Table(name = "product_detail")
public class ProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "price", precision = 24, scale = 2)
    private BigDecimal price;

    @Column(name = "price_sell", precision = 24, scale = 2)
    private BigDecimal priceSell;

    @Column(name = "inventory_quantity")
    private Integer inventoryQuantity;

    @Column(name = "status")
    private Byte status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id")
    private Color color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ram_id")
    private Ram ram;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rom_id")
    private Rom rom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imei_id")
    private Imei imei;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Size(max = 255)
    @Column(name = "image_url")
    private String imageUrl;

}