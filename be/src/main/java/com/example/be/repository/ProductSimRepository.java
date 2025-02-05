package com.example.be.repository;

import com.example.be.entity.ProductSim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductSimRepository extends JpaRepository<ProductSim, Integer> {
  }