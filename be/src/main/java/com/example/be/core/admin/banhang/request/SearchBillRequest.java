package com.example.be.core.admin.banhang.request;

import com.example.be.entity.status.StatusBill;
import lombok.Data;
import java.time.LocalDateTime;



@Data
public class SearchBillRequest {
    private String key;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Byte loaiHoaDon;
    private StatusBill trangThai;

}
