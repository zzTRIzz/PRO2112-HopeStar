package com.example.be.dto;

import com.example.be.entity.Bill;
import com.example.be.entity.ProductDetail;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillDetailDto {
    private Integer id;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal totalPrice;

    private Integer idProductDetail;

    private Integer idBill;

    private String createdBy;

    private String updatedBy;
}
