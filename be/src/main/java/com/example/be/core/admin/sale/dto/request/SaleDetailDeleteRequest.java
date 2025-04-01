// SaleDetailDeleteRequest.java
package com.example.be.core.admin.sale.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class SaleDetailDeleteRequest {
    @NotNull(message = "Danh sách ID không được trống")
    private List<Integer> ids; // Danh sách ID của SaleDetail cần xóa
}