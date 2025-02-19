package com.example.be.repository;

import com.example.be.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail, Integer> {
  @Query("SELECT bd FROM BillDetail bd WHERE bd.idBill.id = :idBill")
  List<BillDetail> findByIdBill(@Param("idBill") Integer idBill);
  }