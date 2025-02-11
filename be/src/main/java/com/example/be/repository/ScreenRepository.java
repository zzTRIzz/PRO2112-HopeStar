package com.example.be.repository;

import com.example.be.entity.Screen;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreenRepository extends BaseRepository<Screen, Integer> {
  }