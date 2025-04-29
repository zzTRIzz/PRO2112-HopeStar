package com.example.be.repository;

import com.example.be.entity.Screen;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreenRepository extends BaseRepository<Screen, Integer> {
  List<Screen> findByStatus(StatusCommon status);
  }