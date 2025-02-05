package com.example.be.entity;

import com.example.be.entity.base.AudiEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "sim")
public class Sim extends AudiEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "code")
    private String code;

    @Size(max = 255)
    @Column(name = "type")
    private String type;

    @Column(name = "sim_multiple")
    private Byte simMultiple;

    @Column(name = "status")
    private Byte status;

}