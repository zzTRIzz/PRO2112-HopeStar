package com.example.be.repository;

import com.example.be.entity.Battery;

import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatteryRepository extends BaseRepository<Battery, Integer> {
  }