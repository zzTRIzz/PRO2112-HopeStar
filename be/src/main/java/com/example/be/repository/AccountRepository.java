package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.repository.base.BaseRepository;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends BaseRepository<Account,Integer> {
    Account findByEmail(@Size(max = 255) String email);
    Account findByPhone(@Size(max = 255) String phone);

    @Query("select a from Account a " +
            "where a.idRole.id = 3")
    List<Account> getAllAcountKhachHang();
}