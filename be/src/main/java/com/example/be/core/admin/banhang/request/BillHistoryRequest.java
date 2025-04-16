package com.example.be.core.admin.banhang.request;

import com.example.be.entity.status.StartusBillHistory;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BillHistoryRequest {

    private Integer id;

    private StartusBillHistory actionType;

    private String note;

    private Integer idBill;

    private Integer idNhanVien;
}
