package com.example.be.core.admin.sale.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
@Data
public class SaleProductAssignRequest {
    @NotNull(message = "Sale ID không được trống")
    private Integer saleId;

    @NotNull(message = "Danh sách sản phẩm không được trống")
    private List<Integer> productDetailIds; // Danh sách ID ProductDetail
}
