package com.example.be.repository;

import com.example.be.entity.Sim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimRepository extends JpaRepository<Sim, Integer> {
}