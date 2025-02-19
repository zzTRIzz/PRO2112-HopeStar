package com.example.be.repository;

import com.example.be.entity.Imei;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImeiRepository extends JpaRepository<Imei, Integer> {
  List<Imei> findByProductDetailId(Integer id);
  }