package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import com.example.be.entity.VoucherAccount;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.entity.status.VoucherAccountStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VoucherAccountRepository extends JpaRepository<VoucherAccount, Integer> {

    @Query("SELECT va FROM VoucherAccount va WHERE va.idVoucher.id = :voucherId AND va.idAccount.id = :accountId")
    Optional<VoucherAccount> findByIdVoucher(@Param("voucherId") Integer voucherId,
                                                         @Param("accountId") Integer accountId);

    // Find by voucher ID
    @Query("SELECT va FROM VoucherAccount va WHERE va.idVoucher.id = :voucherId")
    List<VoucherAccount> findByIdVoucherId(@Param("voucherId") Integer voucherId);

    // Find by account ID
    @Query("SELECT va FROM VoucherAccount va WHERE va.idAccount.id = :accountId")
    List<VoucherAccount> findByIdAccountId(@Param("accountId") Integer accountId);


    // Check if voucher exists
    boolean existsByIdVoucher(Voucher voucher);

    // Check if account has specific voucher
    boolean existsByIdVoucherIdAndIdAccountId(Integer voucherId, Integer accountId);

    List<VoucherAccount> findByIdVoucherAndStatus(Voucher voucher, VoucherAccountStatus status);

    @Modifying
    @Transactional
    @Query("DELETE FROM VoucherAccount va WHERE va.idVoucher.id = :voucherId AND va.idAccount.id = :accountId")
    void deleteByVoucherIdAndAccountId(@Param("voucherId") Integer voucherId,
                                       @Param("accountId") Integer accountId);

    @Query("SELECT va FROM VoucherAccount va WHERE va.idVoucher.id = :voucherId AND va.idAccount.id = :accountId")
    VoucherAccount findByIdVoucherAndIdAccount(@Param("voucherId") Integer voucherId,
                                                       @Param("accountId") Integer accountId);

}