package com.example.be.repository;

import com.example.be.entity.Bluetooth;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BluetoothRepository extends BaseRepository<Bluetooth, Integer> {
  }