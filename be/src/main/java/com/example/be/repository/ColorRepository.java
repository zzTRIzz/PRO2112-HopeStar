package com.example.be.repository;

import com.example.be.entity.Color;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends BaseRepository<Color, Integer> {
  }