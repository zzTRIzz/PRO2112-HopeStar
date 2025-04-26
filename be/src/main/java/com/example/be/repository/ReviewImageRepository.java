package com.example.be.repository;

import com.example.be.entity.ReviewImage;
import com.example.be.entity.status.StatusBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Integer> {

}
