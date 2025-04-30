package com.example.be.repository;

import com.example.be.entity.ProductReviews;
import com.example.be.entity.status.StatusBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewsRepository extends JpaRepository<ProductReviews, Integer> {

    @Query("select pr from ProductReviews pr " +
            "where pr.productDetail.id = :idProductDetail")
    List<ProductReviews> findByProduct(@Param("idProductDetail") Integer idProductDetail);


}
