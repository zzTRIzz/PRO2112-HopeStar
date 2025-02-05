package com.example.be.repository;

import com.example.be.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillDetailRepository extends JpaRepository<BillDetail, Integer> {
}