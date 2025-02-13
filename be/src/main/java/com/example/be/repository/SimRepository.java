package com.example.be.repository;

import com.example.be.entity.Sim;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimRepository extends BaseRepository<Sim, Integer> {
  }