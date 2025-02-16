package com.example.be.repository;

import com.example.be.entity.Product;
import com.example.be.repository.base.BaseRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends BaseRepository<Product, Integer> {
    Page<Product> findAll(Pageable pageable);
  }