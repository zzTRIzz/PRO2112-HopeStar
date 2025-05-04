package com.example.be.core.admin.products_management.dto.model;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class ProductDetailExcelDTO {
    @ExcelProperty("Giá")
    private BigDecimal price;

    @ExcelProperty("Màu sắc")
    private Integer color;

    @ExcelProperty("Rom")
    private Integer rom;

    @ExcelProperty("Ram")
    private Integer ram;


    @ExcelProperty("Hình ảnh")
    private String imageUrl;
}
