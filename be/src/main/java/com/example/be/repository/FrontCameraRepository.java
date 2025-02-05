package com.example.be.repository;

import com.example.be.entity.FrontCamera;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FrontCameraRepository extends JpaRepository<FrontCamera, Integer> {
  }