package com.example.be.repository;

import com.example.be.entity.Rom;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RomRepository extends BaseRepository<Rom, Integer> {
  }