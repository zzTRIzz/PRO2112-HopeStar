package com.example.be.repository;

import com.example.be.entity.Account;
import com.example.be.entity.Role;
import com.example.be.entity.status.StatusCommon;
import com.example.be.entity.status.VoucherAccountStatus;
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

    @Query("select a from Account a where a.idRole.id in (3, 4) " +
            "and a.status = :startus")
    List<Account> getAllAccountKhachHang(@Param("startus")StatusCommon statusCommon);



    @Query("select a from  Account a " +
            "where a.id = (select b.idAccount.id from Bill b where b.id = :idBill)")
    Account getByAccount(@Param("idBill") Integer idBill);

    List<Account> findAccountsByIdRole(Role idRole);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    Boolean existsByEmailAndPhone(String email, String phone);

    boolean existsById(Integer id);

    boolean existsByCode(String code);

//    @Query("SELECT va.idAccount FROM VoucherAccount va " +
//            "WHERE va.idVoucher.id = :voucherId " +
//            "AND va.status = :status")
//    List<Account> getAccountsAddVoucherByStatus(@Param("voucherId") Integer voucherId,
//                                                @Param("status") VoucherAccountStatus status);
@Query("SELECT va.idAccount FROM VoucherAccount va " +
        "WHERE va.idVoucher.id = :voucherId AND (va.status IS NULL OR va.status <> :excludedStatus)")
List<Account> getAccountsAddVoucherByStatus(@Param("voucherId") Integer voucherId,
                                            @Param("excludedStatus") VoucherAccountStatus excludedStatus);

}