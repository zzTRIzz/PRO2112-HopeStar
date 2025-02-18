package com.example.be.repository;

import com.example.be.entity.CartDetail;
import com.example.be.entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Integer> {
  @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED)), 0) + 1 
    FROM rear_camera
    """, nativeQuery = true)
  String getNewCode();



  @Query("SELECT sc FROM ShoppingCart sc WHERE sc.idAccount.id= :idAccount")
  List<ShoppingCart> findByIdShoppingCart(@Param("idAccount") Integer idAccount);
  }