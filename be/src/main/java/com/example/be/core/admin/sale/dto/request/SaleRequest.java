package com.example.be.core.admin.sale.dto.request;

import com.example.be.entity.status.StatusSale;
import jakarta.validation.constraints.*;
import lombok.Data;


import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
public class SaleRequest {
    @NotBlank(message = "Mã chương trình không được để trống")
    @Size(max = 255, message = "Mã chương trình không được vượt quá 255 ký tự")
    private String code;

    @NotBlank(message = "Tên chương trình không được để trống")
    @Size(max = 255, message = "Tên chương trình không được vượt quá 255 ký tự")
    private String name;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime dateStart;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime dateEnd;

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    private String description;

    @NotNull(message = "Giá trị giảm không được để trống")
    @Min(value = 0, message = "Giá trị giảm không được nhỏ hơn 0")
    private Integer discountValue;

    @NotNull(message = "Loại giảm giá không được để trống")
    private Boolean discountType;

    private StatusSale status;

}
