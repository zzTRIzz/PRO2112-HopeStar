package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "imei_sold")
public class ImeiSold {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_imei")
    private Imei id_Imei;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_bill_detail")
    private BillDetail idBillDetail;
}
