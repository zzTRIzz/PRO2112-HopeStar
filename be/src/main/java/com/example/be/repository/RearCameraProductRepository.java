package com.example.be.repository;

import com.example.be.entity.RearCameraProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RearCameraProductRepository extends JpaRepository<RearCameraProduct, Integer> {
  List<RearCameraProduct> findByProductId(Integer id);
  }