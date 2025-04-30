package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.entity.status.VoucherAccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    @Query("SELECT v FROM Voucher v JOIN Bill b ON b.idVoucher.id = v.id " +
            "WHERE b.id = :idBill")
    Voucher findByIdVoucher(@Param("idBill") Integer idBill);

    @Query("SELECT v FROM Voucher v " +
            "JOIN VoucherAccount va ON va.idVoucher.id = v.id " +
            "WHERE va.idAccount.id = :idAccount " +
            "AND v.quantity > 0 " +
            "AND v.startTime <= :dateTime " +
            "AND v.endTime >= :dateTime ")
    List<Voucher> findByIdAccount(@Param("idAccount") Integer idAccount,
                                  @Param("dateTime") LocalDateTime dateTime);


    @Query("SELECT v FROM Voucher v " +
            "JOIN VoucherAccount va ON v = va.idVoucher " +
            "WHERE va.idAccount.id = :idAccount " +
            "AND v.conditionPriceMin <= (SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
            "AND v.conditionPriceMax >= (SELECT COALESCE(SUM(b.totalPrice), 0) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
            "ORDER BY v.discountValue DESC")
    List<Voucher> findByCodeContainingIgnoreCase(String code);

    @Query("SELECT v FROM Voucher v WHERE v.startTime BETWEEN :startTime AND :endTime")
    List<Voucher> findByStartTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Query("SELECT v FROM Voucher v ORDER BY v.id DESC")
    List<Voucher> findAllOrderByIdDesc();

    @Query("SELECT v FROM Voucher v WHERE LOWER(v.code) LIKE LOWER(CONCAT('%', :code, '%')) AND v.startTime >= :startTime AND v.endTime <= :endTime")
    List<Voucher> findByCodeAndDateRange(
            @Param("code") String code,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Integer id);

    @Query("""
                SELECT v FROM Voucher v 
                WHERE (:keyword IS NULL OR 
                       LOWER(v.code) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                       LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
                AND (:startTime IS NULL OR v.startTime >= :startTime)
                AND (:endTime IS NULL OR v.endTime <= :endTime)
                AND (:isPrivate IS NULL OR v.isPrivate = :isPrivate)
                AND (:status IS NULL OR v.status = :status)
                ORDER BY v.id DESC
            """)
    List<Voucher> findByDynamicFilters(
            @Param("keyword") String keyword,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("isPrivate") Boolean isPrivate,
            @Param("status") StatusVoucher status
    );

    // ... ap dung voucher

    @Query("SELECT va.idVoucher FROM VoucherAccount va WHERE va.idAccount = :account " +
            "AND va.status = 'NOT_USED'")
    List<Voucher> findValidNotUsedVouchers(@Param("account") Account account);

    List<Voucher> findByIsPrivateAndQuantityGreaterThanAndStatus(Boolean isPrivate, Integer quantity, StatusVoucher statusVoucher);

    Voucher findByIdAndStatus(Integer id, StatusVoucher statusVoucher);

}