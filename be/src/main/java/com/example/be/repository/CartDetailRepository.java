package com.example.be.repository;

import com.example.be.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

  @Query("SELECT c FROM CartDetail c WHERE c.idShoppingCart.id = :idGH")
  List<CartDetail> findByIdGH(@Param("idGH") Integer idGH);
  }