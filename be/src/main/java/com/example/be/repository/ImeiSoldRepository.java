package com.example.be.repository;

import com.example.be.entity.ImeiSold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImeiSoldRepository extends JpaRepository< ImeiSold, Integer> {
}
