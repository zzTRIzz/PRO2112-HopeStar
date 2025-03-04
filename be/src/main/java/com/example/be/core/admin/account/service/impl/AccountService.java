package com.example.be.core.admin.account.service.impl;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.RoleResponse;
import com.example.be.entity.Account;
import com.example.be.entity.Role;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.AccountRepository;
import com.example.be.core.admin.account.dto.request.AccountRequest;
import com.example.be.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    private final RoleRepository roleRepository;

    public AccountResponse create(AccountRequest request) {
        Role role = roleRepository.findById(request.getIdRole()).orElseThrow(
                () -> new RuntimeException("Role not found")
        );
        Account account = new Account();
        account.setFullName(request.getFullName());
        account.setCode("USER_"+ accountRepository.getNewCode());
        account.setEmail(request.getEmail());
        account.setPassword(request.getPassword());
        account.setPhone(request.getPhone());
        account.setAddress(request.getAddress());
        account.setGoogleId(request.getGoogleId());
        account.setImageAvatar(request.getImageAvatar());
        account.setIdRole(role);
        account.setGender(false);
        account.setStatus(StatusCommon.ACTIVE);
        return convertToResponse(accountRepository.save(account));
    }

    public List<AccountResponse> getAll() {
        return accountRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private AccountResponse convertToResponse(Account account) {
        RoleResponse roleResponse = roleRepository.findById(account.getIdRole().getId())
                .map(role -> {
                    RoleResponse roleResponse1 = new RoleResponse();
                    roleResponse1.setId(role.getId());
                    roleResponse1.setCode(role.getCode());
                    roleResponse1.setName(role.getName());
                    return roleResponse1;
                }).orElse(null);

        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setFullName(account.getFullName());
        response.setCode(account.getCode());
        response.setEmail(account.getEmail());
        response.setPassword(account.getPassword());
        response.setPhone(account.getPhone());
        response.setAddress(account.getAddress());
        response.setGoogleId(account.getGoogleId());
        response.setImageAvatar(account.getImageAvatar());
        response.setIdRole(roleResponse);
        response.setGender(account.getGender());
        response.setStatus(String.valueOf(account.getStatus()));

        return response;
    }

    public AccountResponse update(Integer id, AccountRequest request) {
        Role role = roleRepository.findById(request.getIdRole()).orElseThrow(
                () -> new RuntimeException("Role not found")
        );
        Account account = accountRepository.findById(id).orElseThrow();
        account.setFullName(request.getFullName());
        account.setEmail(request.getEmail());
        account.setPassword(request.getPassword());
        account.setPhone(request.getPhone());
        account.setAddress(request.getAddress());
        account.setGoogleId(request.getGoogleId());
        account.setImageAvatar(request.getImageAvatar());
        account.setIdRole(role);
        account.setGender(request.getGender());
        account.setStatus(StatusCommon.valueOf(request.getStatus()));
        return convertToResponse(accountRepository.save(account));
    }

    public AccountResponse getById(Integer id) {
        return accountRepository.findById(id)
                .map(this::convertToResponse)
                .orElse(null);
    }




    public List<AccountResponse> getAllKhachHang() {

        return accountRepository.getAllAcountKhachHang().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }



}
