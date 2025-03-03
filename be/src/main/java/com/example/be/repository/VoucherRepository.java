package com.example.be.repository;

import com.example.be.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
  @Query("SELECT v FROM Voucher v " +
          "JOIN VoucherAccount va ON v = va.idVoucher " +
          "WHERE va.idAccount.id = :idAccount " +
          "AND v.conditionPriceMin <= (SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
          "AND v.conditionPriceMax >= (SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
          "ORDER BY v.discountValue DESC")
  List<Voucher> giamGiaTotNhat(@Param("idAccount") Integer idAccount);
  }