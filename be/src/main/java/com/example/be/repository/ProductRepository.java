package com.example.be.repository;

import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.entity.Product;
import com.example.be.repository.base.BaseRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends BaseRepository<Product, Integer> {
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN p.brand b " +
            "LEFT JOIN p.screen s " +
            "LEFT JOIN p.card c " +
            "LEFT JOIN p.os o " +
            "LEFT JOIN p.wifi w " +
            "LEFT JOIN p.bluetooth bt " +
            "LEFT JOIN p.battery ba " +
            "LEFT JOIN ProductCategory pc ON p.id = pc.product.id " +
            "LEFT JOIN pc.category cat " +
            "WHERE (:#{#searchRequest.code} IS NULL OR p.code LIKE %:#{#searchRequest.code}%) " +
            "AND (:#{#searchRequest.name} IS NULL OR p.name LIKE %:#{#searchRequest.name}%) " +
            "AND (:#{#searchRequest.idChip} IS NULL OR p.chip.id = :#{#searchRequest.idChip}) " +
            "AND (:#{#searchRequest.idBrand} IS NULL OR b.id = :#{#searchRequest.idBrand}) " +
            "AND (:#{#searchRequest.idScreen} IS NULL OR s.id = :#{#searchRequest.idScreen}) " +
            "AND (:#{#searchRequest.idCard} IS NULL OR c.id = :#{#searchRequest.idCard}) " +
            "AND (:#{#searchRequest.idOs} IS NULL OR o.id = :#{#searchRequest.idOs}) " +
            "AND (:#{#searchRequest.idWifi} IS NULL OR w.id = :#{#searchRequest.idWifi}) " +
            "AND (:#{#searchRequest.idBluetooth} IS NULL OR bt.id = :#{#searchRequest.idBluetooth}) " +
            "AND (:#{#searchRequest.idBattery} IS NULL OR ba.id = :#{#searchRequest.idBattery}) " +
            "AND (:#{#searchRequest.idCategory} IS NULL OR cat.id = :#{#searchRequest.idCategory})")
    List<Product> findAllMatching(@Param("searchRequest") SearchProductRequest searchRequest);

  }