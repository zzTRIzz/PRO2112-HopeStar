package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import com.example.be.entity.VoucherAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherAccountRepository extends JpaRepository<VoucherAccount, Integer> {
    @Query("SELECT COUNT(va) > 0 FROM VoucherAccount va WHERE va.idAccount = :account AND va.idVoucher = :voucher")
    boolean existsByIdAccountAndIdVoucher(@Param("account") Account account, @Param("voucher") Voucher voucher);
}