package com.example.be.repository;

import com.example.be.entity.Chip;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChipRepository extends BaseRepository<Chip, Integer> {
  }