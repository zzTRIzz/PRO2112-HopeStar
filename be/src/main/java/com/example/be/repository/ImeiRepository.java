package com.example.be.repository;

import com.example.be.entity.Imei;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImeiRepository extends JpaRepository<Imei, Integer> {
  }