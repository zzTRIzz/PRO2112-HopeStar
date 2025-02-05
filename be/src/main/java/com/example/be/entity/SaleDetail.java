package com.example.be.entity;

import com.example.be.entity.base.AudiEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "sale_detail")
public class SaleDetail extends AudiEntity {
    @EmbeddedId
    private SaleDetailId id;

    @MapsId("saleId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @MapsId("productDetailId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_detail_id", nullable = false)
    private ProductDetail productDetail;

    @Column(name = "effective_price", precision = 24, scale = 2)
    private BigDecimal effectivePrice;

}