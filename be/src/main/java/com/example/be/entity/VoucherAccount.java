package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.VoucherAccountStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "voucher_account")
public class VoucherAccount extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_account")
    private Account idAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_voucher")
    private Voucher idVoucher;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VoucherAccountStatus status;

    @Column(name = "used_date")
    private LocalDateTime usedDate;
}