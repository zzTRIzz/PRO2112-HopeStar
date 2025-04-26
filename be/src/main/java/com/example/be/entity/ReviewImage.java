package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "review_image")
public class ReviewImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product_reviews", nullable = false)
    private ProductReviews productReviews;
}
