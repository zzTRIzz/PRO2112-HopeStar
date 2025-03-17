package com.example.be.repository;

import com.example.be.entity.ProductSim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSimRepository extends JpaRepository<ProductSim, Integer> {
  List<ProductSim> findByProductId(Integer id);
  }