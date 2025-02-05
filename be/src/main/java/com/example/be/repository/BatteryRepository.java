package com.example.be.repository;

import com.example.be.entity.Battery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatteryRepository extends JpaRepository<Battery, Integer> {
  }