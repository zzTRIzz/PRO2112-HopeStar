package com.example.be.entity;

import com.example.be.entity.base.AudiEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "imei")
public class Imei extends AudiEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 20)
    @NotNull
    @Column(name = "imei_code", nullable = false, length = 20)
    private String imeiCode;

    @Size(max = 1000)
    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "status")
    private Byte status;

}