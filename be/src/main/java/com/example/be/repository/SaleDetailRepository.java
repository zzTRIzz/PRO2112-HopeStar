package com.example.be.repository;

import com.example.be.entity.SaleDetail;
import com.example.be.entity.SaleDetailId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, SaleDetailId> {
  }