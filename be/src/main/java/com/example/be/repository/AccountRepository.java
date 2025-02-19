package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.repository.base.BaseRepository;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends BaseRepository<Account,Integer> {
    Account findByEmail(@Size(max = 255) String email);
    Account findByPhone(@Size(max = 255) String phone);
}