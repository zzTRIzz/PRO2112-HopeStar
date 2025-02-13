package com.example.be.repository;

import com.example.be.entity.Category;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends BaseRepository<Category, Integer> {
  }