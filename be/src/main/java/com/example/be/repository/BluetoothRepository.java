package com.example.be.repository;

import com.example.be.entity.Bluetooth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BluetoothRepository extends JpaRepository<Bluetooth, Integer> {
  }