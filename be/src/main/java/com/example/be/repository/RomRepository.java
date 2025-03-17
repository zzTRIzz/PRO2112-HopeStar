package com.example.be.repository;

import com.example.be.entity.Rom;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RomRepository extends BaseRepository<Rom, Integer> {

  List<Rom> findByStatus(StatusCommon status);

  @Query("SELECT COUNT(b) FROM #{#entityName} b WHERE b.capacity = :capacity")
  long countByCapacity(@Param("capacity") Integer capacity);

  @Query("SELECT COUNT(b) FROM #{#entityName} b WHERE b.capacity = :capacity AND b.id <> :id")
  long countByCapacityAndNotId(@Param("capacity") Integer capacity, @Param("id") Integer id);
  }