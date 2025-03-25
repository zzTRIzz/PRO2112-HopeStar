package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.entity.Role;
import com.example.be.repository.base.BaseRepository;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends BaseRepository<Account,Integer> {
    Account findByEmail(@Size(max = 255) String email);
    Account findByPhone(@Size(max = 255) String phone);

    @Query("select a from Account a " +
            "where a.idRole.id = 4")
    List<Account> getAllAcountKhachHang();



    @Query("select a from  Account a " +
            "where a.id = (select b.idAccount.id from Bill b where b.id = :idBill)")
    Account getByAccount(@Param("idBill") Integer idBill);

    List<Account> findAccountsByIdRole(Role idRole);
}