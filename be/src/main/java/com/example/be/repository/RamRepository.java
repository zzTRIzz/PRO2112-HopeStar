package com.example.be.repository;

import com.example.be.entity.Ram;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RamRepository extends BaseRepository<Ram, Integer> {
  }