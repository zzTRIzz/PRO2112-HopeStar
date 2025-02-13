package com.example.be.repository;

import com.example.be.entity.RearCamera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RearCameraRepository extends JpaRepository<RearCamera, Integer> {
  @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)), 0) + 1 
    FROM rear_camera
    """, nativeQuery = true)
  String getNewCode();
  }