package com.example.be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class SaleDetailId implements Serializable {
    private static final long serialVersionUID = -5063759099984907930L;
    @NotNull
    @Column(name = "sale_id", nullable = false)
    private Integer saleId;

    @NotNull
    @Column(name = "product_detail_id", nullable = false)
    private Integer productDetailId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SaleDetailId entity = (SaleDetailId) o;
        return Objects.equals(this.saleId, entity.saleId) &&
                Objects.equals(this.productDetailId, entity.productDetailId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(saleId, productDetailId);
    }

}