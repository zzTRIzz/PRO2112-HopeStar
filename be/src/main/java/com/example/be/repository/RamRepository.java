package com.example.be.repository;

import com.example.be.entity.Ram;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RamRepository extends JpaRepository<Ram, Integer> {
}