package com.example.be.repository;

import com.example.be.entity.FrontCamera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FrontCameraRepository extends JpaRepository<FrontCamera, Integer> {
  @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)), 0) + 1 
    FROM front_camera
    """, nativeQuery = true)
  String getNewCode();
  }