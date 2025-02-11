package com.example.be.repository;

import com.example.be.entity.Os;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OsRepository extends BaseRepository<Os, Integer> {
  }