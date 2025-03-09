package com.example.be.repository;

import com.example.be.entity.Voucher;
import com.example.be.entity.status.StatusVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
//    @Query("SELECT v FROM Voucher v " +
//            "JOIN VoucherAccount va ON v = va.idVoucher " +
//            "WHERE va.idAccount.id = :idAccount AND v.status = :status " +
//            "AND v.conditionPriceMin <= (SELECT MAX(b.totalPrice) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
//            "AND v.conditionPriceMax >= (SELECT MAX(b.totalPrice) FROM Bill b WHERE b.idAccount.id = :idAccount) " +
//            "AND v.quantity > 0 AND v.voucherType = false " +
//            "ORDER BY v.discountValue DESC")


    @Query("SELECT v FROM Voucher v " +
            "JOIN VoucherAccount va ON v = va.idVoucher " +
            "WHERE va.idAccount.id = :idAccount " +
            "AND v.status = :status " +
            "AND v.conditionPriceMin <= ( " +
            "    SELECT COALESCE(MAX(b.totalPrice), 0) " +
            "    FROM Bill b WHERE b.idAccount.id = :idAccount " +
            ") " +
            "AND v.conditionPriceMax >= ( " +
            "    SELECT COALESCE(MAX(b.totalPrice), 0) " +
            "    FROM Bill b WHERE b.idAccount.id = :idAccount " +
            ") " +
            "AND v.quantity > 0 " +
            "AND v.voucherType = false " +
            "ORDER BY v.discountValue DESC")
    List<Voucher> giamGiaTotNhat(@Param("idAccount") Integer idAccount,
                                 @Param("status") StatusVoucher status);

}