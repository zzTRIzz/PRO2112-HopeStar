package com.example.be.repository;

import com.example.be.entity.Rom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RomRepository extends JpaRepository<Rom, Integer> {
}