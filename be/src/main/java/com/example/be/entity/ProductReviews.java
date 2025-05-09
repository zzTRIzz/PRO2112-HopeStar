package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "product_reviews")
public class ProductReviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "general_rating")
    private Integer generalRating;

    @Column(length = 255)
    private String comment;

    @Column(name = "date_assessment")
    private LocalDateTime dateAssessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_account", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product_detail", nullable = false)
    private ProductDetail productDetail;

    @OneToMany(mappedBy = "productReviews", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewImage> images;
}
