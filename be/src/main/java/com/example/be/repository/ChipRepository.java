package com.example.be.repository;

import com.example.be.entity.Chip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChipRepository extends JpaRepository<Chip, Integer> {
  }