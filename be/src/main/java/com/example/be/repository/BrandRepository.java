package com.example.be.repository;

import com.example.be.entity.Brand;
import com.example.be.repository.base.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends BaseRepository<Brand, Integer> {
  }