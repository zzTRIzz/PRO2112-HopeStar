package com.example.be.entity;

import com.example.be.entity.base.AuditEntity;
import com.example.be.entity.status.StatusCommon;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "product")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    //@Lob
    @Size(max = 5000)
    @Column(name = "description")
    private String description;

    @Column(name = "weight")
    private Integer weight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chip_id")
    private Chip chip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id")
    private Screen screen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id")
    private Card card;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "os_id")
    private Os os;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wifi_id")
    private Wifi wifi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bluetooth_id")
    private Bluetooth bluetooth;

    @Column(name = "nfc")
    private Boolean nfc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "battery_id")
    private Battery battery;

    @Column(name = "charger_type")
//    @Enumerated(EnumType.STRING)
    private String chargerType;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusCommon status;

    @Lob
    @Column(name = "content")
    private String content;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<ProductDetail> productDetails= new ArrayList<>();

}