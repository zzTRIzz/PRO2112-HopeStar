package com.example.be.core.admin.banhang.respones;

import com.example.be.entity.Account;
import com.example.be.entity.Bill;
import com.example.be.entity.status.StartusBillHistory;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BillHistoryRespones {

    private Integer id;

    private StartusBillHistory actionType;

    private String note;

    private LocalDateTime actionTime;

    private Integer IdNhanVien;

    private String fullName;
}
