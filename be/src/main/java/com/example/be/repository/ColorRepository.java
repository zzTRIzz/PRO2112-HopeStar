package com.example.be.repository;

import com.example.be.entity.Color;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColorRepository extends BaseRepository<Color, Integer> {

  List<Color> findByStatus(StatusCommon status);

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM #{#entityName} b WHERE LOWER(TRIM(b.name)) = LOWER(TRIM(:name))") // trim ko hoat dong
  boolean existsByNameTrimmedIgnoreCase(@Param("name") String name);

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM #{#entityName} b WHERE LOWER(TRIM(b.name)) = LOWER(TRIM(:name)) AND b.id <> :id")
  boolean existsByNameTrimmedIgnoreCaseAndNotId(@Param("name") String name, @Param("id") Integer id);
  }