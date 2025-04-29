package com.example.be.core.admin.statistic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class LowStockProductResponse {
    private String maSP;
    private String tenSP;
    private String mauSac;
    private Integer soLuong;
    private String trangThai;
    private String imageUrl; // Thêm trường này
}
