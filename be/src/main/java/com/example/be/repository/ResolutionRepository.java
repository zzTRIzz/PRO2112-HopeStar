package com.example.be.repository;

import com.example.be.entity.Resolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ResolutionRepository extends JpaRepository<Resolution, Integer> {
  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
          "FROM #{#entityName} b " +
          "WHERE LOWER(TRIM(b.resolutionType)) = LOWER(TRIM(:resolutionType)) " +
          "AND b.height = :height " +
          "AND b.width = :width ")
  boolean existsByHeightAndWidthAndResolutionTypeTrimmedIgnoreCase(
          @Param("height") Integer height,
          @Param("width") Integer width,
          @Param("resolutionType") String resolutionType);

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
          "FROM #{#entityName} b " +
          "WHERE LOWER(TRIM(b.resolutionType)) = LOWER(TRIM(:resolutionType)) " +
          "AND b.height = :height " +
          "AND b.width = :width " +
          "AND b.id <> :id")
  boolean existsByHeightAndWidthAndResolutionTypeTrimmedIgnoreCaseAndNotId(
          @Param("height") Integer height,
          @Param("width") Integer width,
          @Param("resolutionType") String resolutionType,
          @Param("id") Integer id);


}