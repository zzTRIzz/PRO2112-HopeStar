package com.example.be.repository;

import com.example.be.entity.FrontCamera;
import com.example.be.entity.status.StatusCommon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FrontCameraRepository extends JpaRepository<FrontCamera, Integer> {

  List<FrontCamera> findByStatus(StatusCommon status);

  @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)), 0) + 1 
    FROM front_camera
    """, nativeQuery = true)
  String getNewCode();

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM FrontCamera b WHERE LOWER(TRIM(b.type)) = LOWER(TRIM(:type)) AND b.resolution = :resolution")
  boolean existsByTypeAndResolution(@Param("type") String type, @Param("resolution") Integer resolution);

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM FrontCamera b WHERE LOWER(TRIM(b.type)) = LOWER(TRIM(:type)) AND b.resolution = :resolution AND b.id <> :id")
  boolean existsByTypeAndResolutionAndNotId(@Param("type") String type, @Param("resolution") Integer resolution, @Param("id") Integer id);
  }