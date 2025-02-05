package com.example.be.repository;

import com.example.be.entity.FrontCameraProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FrontCameraProductRepository extends JpaRepository<FrontCameraProduct, Integer> {
  }