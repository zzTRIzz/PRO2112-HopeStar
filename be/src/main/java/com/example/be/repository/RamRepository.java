package com.example.be.repository;

import com.example.be.entity.Ram;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RamRepository extends BaseRepository<Ram, Integer> {

  List<Ram> findByStatus(StatusCommon status);

  @Query("SELECT COUNT(b) FROM #{#entityName} b WHERE b.capacity = :capacity")
  long countByCapacity(@Param("capacity") Integer capacity);

  @Query("SELECT COUNT(b) FROM #{#entityName} b WHERE b.capacity = :capacity AND b.id <> :id")
  long countByCapacityAndNotId(@Param("capacity") Integer capacity, @Param("id") Integer id);

}