package com.example.be.repository;
import com.example.be.entity.ProductReviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductReviewsRepository extends JpaRepository<ProductReviews, Integer> {
}
