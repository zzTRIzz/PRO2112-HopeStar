package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.StartusBillHistory;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "bill_history")
public class BillHistory extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "action_type", nullable = false)
    private StartusBillHistory actionType;

    @Column(name = "note")
    private String note;

    @Column(name = "action_time", nullable = false)
    private LocalDateTime actionTime;

    @ManyToOne
    @JoinColumn(name = "id_bill", nullable = false)
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    private Account nhanVien;

}
