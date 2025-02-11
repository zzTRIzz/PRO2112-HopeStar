package com.example.be.repository;

import com.example.be.entity.Card;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends BaseRepository<Card, Integer> {
  }