package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.entity.ShoppingCart;
import com.example.be.repository.base.BaseRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Integer> {
  @Query(value = """
    SELECT COALESCE(MAX(CAST(SUBSTRING(code,8) AS UNSIGNED)), 0) + 1
    FROM shopping_cart
    """, nativeQuery = true)
  String getNewCode();

  ShoppingCart findShoppingCartByIdAccount(Account account);
}