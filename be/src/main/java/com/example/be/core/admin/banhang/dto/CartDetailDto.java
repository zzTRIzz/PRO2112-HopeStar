package com.example.be.core.admin.banhang.dto;

import com.example.be.entity.ProductDetail;
import com.example.be.entity.ShoppingCart;
import com.example.be.entity.status.StatusCartDetail;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartDetailDto {
    private Integer id;

    private Integer quantity;

    private Integer idProductDetail;

    private Integer idShoppingCart;

    private StatusCartDetail status;
}
