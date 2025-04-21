package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.ProductDetailStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
//@ToString
@Entity
@Table(name = "product_detail")
public class ProductDetail extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "code")
    private String code;

    @Column(name = "price", precision = 24, scale = 2)
    private BigDecimal price;

    @JsonIgnore
    @OneToMany(mappedBy = "productDetail")
    private Set<Imei> imeis;

    @Column(name = "price_sell", precision = 24, scale = 2)
    private BigDecimal priceSell;

    @Column(name = "inventory_quantity")
    private Integer inventoryQuantity;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ProductDetailStatus status;

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
    @JoinColumn(name = "product_id")
    private Product product;

    @Size(max = 255)
    @Column(name = "image_url")
    private String imageUrl;

}