package com.example.be.repository;

import com.example.be.entity.FrontCameraProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FrontCameraProductRepository extends JpaRepository<FrontCameraProduct, Integer> {
  List<FrontCameraProduct> findByProductId(Integer id);
  }