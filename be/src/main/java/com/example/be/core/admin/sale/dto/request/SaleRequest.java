// SaleRequest
package com.example.be.core.admin.sale.dto.request;

import lombok.Data;

import java.time.Instant;

@Data
public class SaleRequest {
    private String code;
    private String name;
    private Instant dateStart;
    private Instant dateEnd;
    private String status;
    private String description;
    private Integer discountValue;
    private Boolean discountType;
}
