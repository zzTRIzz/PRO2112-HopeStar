package com.example.be.repository;

import com.example.be.entity.VoucherAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherAccountRepository extends JpaRepository<VoucherAccount, Integer> {
  }