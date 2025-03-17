package com.example.be.core.admin.account.service;

import com.example.be.entity.Account;
import com.example.be.core.admin.account.dto.request.AccountRequest;

import java.util.List;

public interface AccountServices {
    List<Account> getAll();
    Account create(AccountRequest request);
    Account update(Integer id,AccountRequest request);
    Account getById(Integer id);
    List<Account> getByAccount();

}
