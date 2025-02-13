package com.example.be.repository;

import com.example.be.entity.Wifi;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WifiRepository extends BaseRepository<Wifi, Integer> {
  }