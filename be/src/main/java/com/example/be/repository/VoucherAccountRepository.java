package com.example.be.repository;

import com.example.be.entity.Voucher;
import com.example.be.entity.VoucherAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoucherAccountRepository extends JpaRepository<VoucherAccount, Integer> {
  boolean existsByIdVoucherIdAndIdAccountId(Integer voucherId, Integer accountId);
  List<VoucherAccount> findByIdVoucherId(Integer voucherId);
  Boolean existsByIdVoucher(Voucher voucher);
}