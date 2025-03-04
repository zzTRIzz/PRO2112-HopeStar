package com.example.be.repository;

import com.example.be.entity.Imei;
import com.example.be.entity.status.StatusImei;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImeiRepository extends JpaRepository<Imei, Integer> {
  List<Imei> findByProductDetailId(Integer id);

  List<Imei> findByIdIn(List<Integer> idImei);


  @Query("select i from Imei i " +
          "where i.status = :status")
  List<Imei> getAllImeiChuaBan(@Param("status")StatusImei statusImei);
  }