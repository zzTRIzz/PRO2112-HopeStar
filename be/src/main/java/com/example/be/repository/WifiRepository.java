package com.example.be.repository;

import com.example.be.entity.Wifi;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WifiRepository extends JpaRepository<Wifi, Integer> {
}