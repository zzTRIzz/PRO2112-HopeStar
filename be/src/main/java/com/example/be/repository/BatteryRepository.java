package com.example.be.repository;

import com.example.be.entity.Battery;

import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatteryRepository extends BaseRepository<Battery, Integer> {
  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM #{#entityName} b WHERE LOWER(TRIM(b.type)) = LOWER(TRIM(:type)) AND b.capacity = :capacity")
  boolean existsByTypeAndCapacity(@Param("type") String type, @Param("capacity") Integer capacity);

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM #{#entityName} b WHERE LOWER(TRIM(b.type)) = LOWER(TRIM(:type)) AND b.capacity = :capacity AND b.id <> :id")
  boolean existsByTypeAndCapacityAndNotId(@Param("type") String type, @Param("capacity") Integer capacity, @Param("id") Integer id);

  List<Battery> findByStatus(StatusCommon status);
  }