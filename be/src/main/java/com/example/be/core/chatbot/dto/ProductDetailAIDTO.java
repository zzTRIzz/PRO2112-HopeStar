package com.example.be.core.chatbot.dto;


import com.example.be.entity.status.ProductDetailStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductDetailAIDTO {
    //private Integer id;
    private BigDecimal priceSell;
    private Integer inventoryQuantity;
    private ProductDetailStatus status;
    private String colorName;
    private Integer ramCapacity;
    private Integer romCapacity;
}
