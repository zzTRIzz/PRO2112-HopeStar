package com.example.be.repository;

import com.example.be.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
  @Query("SELECT v FROM Voucher v " +
          "JOIN VoucherAccount va ON v = va.idVoucher " +
          "WHERE va.idAccount.id = :idAccount " +
          "AND v.conditionPriceMin <= (SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
          "AND v.conditionPriceMax >= (SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
          "ORDER BY v.discountValue DESC")
  List<Voucher> giamGiaTotNhat(@Param("idAccount") Integer idAccount);
  List<Voucher> findByCodeContainingIgnoreCase(String code);
  @Query("SELECT v FROM Voucher v WHERE v.startTime BETWEEN :startTime AND :endTime")
  List<Voucher> findByStartTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
  @Query("SELECT v FROM Voucher v ORDER BY v.id DESC")
  List<Voucher> findAllOrderByIdDesc();
}