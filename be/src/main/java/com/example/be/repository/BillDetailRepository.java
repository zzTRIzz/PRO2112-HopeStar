package com.example.be.repository;

import com.example.be.entity.BillDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail, Integer> {
  @Query("SELECT bd FROM BillDetail bd WHERE bd.idBill.id = :idBill")
  List<BillDetail> findByIdBill(@Param("idBill") Integer idBill);



  @Modifying
  @Transactional
   @Query("DELETE FROM BillDetail bd WHERE bd.idBill.id = :idBill")
  void deleteByIDBill(@Param("idBill") Integer idBill);


  @Query("SELECT bd FROM BillDetail bd WHERE bd.idBill.id = :idBill AND bd.idProductDetail.id = :idProductDetail")
  Optional<BillDetail> findFirstByIdBillAndIdProductDetail(@Param("idBill") Integer idBill,
                                                           @Param("idProductDetail") Integer idProductDetail);


  }