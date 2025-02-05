package com.example.be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "battery")
public class Battery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "code")
    private String code;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "type")
    private Byte type;

    @Column(name = "status")
    private Byte status;

}