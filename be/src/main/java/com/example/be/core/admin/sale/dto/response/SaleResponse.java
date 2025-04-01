// SaleResponse
package com.example.be.core.admin.sale.dto.response;

import com.example.be.entity.status.StatusSale;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SaleResponse {
    private Integer id;
    private String code;
    private String name;
    private LocalDateTime dateStart;
    private LocalDateTime dateEnd;
    private String description;
    private Integer discountValue;
    private Boolean discountType;
    private StatusSale status;
}
