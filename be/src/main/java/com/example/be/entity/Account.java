package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.StatusCommon;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "account")
public class Account extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

//    @Size(max = 255)
    @Column(name = "full_name")
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Size(max = 255)
    @Column(name = "code")
    private String code;

    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Size(max = 256)
    @Column(name = "password", length = 256)
    private String password;

//    @Size(max = 255)
    @Column(name = "phone")
    private String phone;

    @Size(max = 255)
    @Column(name = "address")
    private String address;

    @Size(max = 1000)
    @Column(name = "google_id", length = 1000)
    private String googleId;

    @Size(max = 255)
    @Column(name = "image_avatar")
    private String imageAvatar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_role")
    private Role idRole;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusCommon status;

}