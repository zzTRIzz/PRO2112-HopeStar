package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.ContactType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contact")
public class Contact extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name")
    @NotBlank(message = "Tên không được bỏ trống")
    private String name;

    @Column(name = "email")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(name = "phone")
    @NotBlank(message = "Số điện thoại không được bỏ trống")
    private String phone;

    @Column(name = "content")
    @NotBlank(message = "Nội dung không được bỏ trống")
    private String content;

    @Lob
    @Column(name = "reply", columnDefinition = "TEXT")
    private String reply;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private ContactType type;
}
