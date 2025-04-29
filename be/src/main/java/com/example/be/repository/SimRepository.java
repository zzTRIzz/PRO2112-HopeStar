package com.example.be.repository;

import com.example.be.entity.Sim;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimRepository extends BaseRepository<Sim, Integer> {

  List<Sim> findByStatus(StatusCommon status);

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM #{#entityName} b WHERE LOWER(TRIM(b.type)) = LOWER(TRIM(:type))")
  boolean existsByTypeTrimmedIgnoreCase(@Param("type") String type);


  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM #{#entityName} b WHERE LOWER(TRIM(b.type)) = LOWER(TRIM(:type)) AND b.id <> :id")
  boolean existsByTypeTrimmedIgnoreCaseAndNotId(@Param("type") String type, @Param("id") Integer id);
  }