package com.example.be.repository;

import com.example.be.entity.Os;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OsRepository extends JpaRepository<Os, Integer> {
  }