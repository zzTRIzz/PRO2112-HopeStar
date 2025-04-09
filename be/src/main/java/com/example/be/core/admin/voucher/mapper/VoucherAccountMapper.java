package com.example.be.core.admin.voucher.mapper;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.RoleResponse;
import com.example.be.core.admin.voucher.dto.model.VoucherAccountDTO;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Account;
import com.example.be.entity.VoucherAccount;
import com.example.be.entity.status.VoucherAccountStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class VoucherAccountMapper {
    private final VoucherMapper voucherMapper;

    public VoucherAccountDTO toDTO(VoucherAccount entity) {
        if (entity == null) return null;

        VoucherAccountDTO dto = new VoucherAccountDTO();
        dto.setId(entity.getId());

        // Map voucher using existing VoucherMapper
        if (entity.getIdVoucher() != null) {
            VoucherResponse voucherResponse = voucherMapper.toResponse(entity.getIdVoucher());
            dto.setVoucher(voucherResponse);
        }

        // Map account directly
        if (entity.getIdAccount() != null) {
            Account account = entity.getIdAccount();
            AccountResponse accountResponse = new AccountResponse();
            accountResponse.setId(account.getId());
            accountResponse.setFullName(account.getFullName());
            accountResponse.setCode(account.getCode());
            accountResponse.setEmail(account.getEmail());
            accountResponse.setPhone(account.getPhone());
            accountResponse.setAddress(account.getAddress());
            accountResponse.setGoogleId(account.getGoogleId());
            accountResponse.setImageAvatar(account.getImageAvatar());

            // Map role
            RoleResponse roleResponse = new RoleResponse();
            roleResponse.setId(account.getIdRole().getId());
            roleResponse.setCode(account.getIdRole().getCode());
            roleResponse.setName(account.getIdRole().getName());
            accountResponse.setIdRole(roleResponse);

            accountResponse.setGender(account.getGender());
            accountResponse.setBirthDate(account.getBirthDate());
            accountResponse.setStatus(String.valueOf(account.getStatus()));

            dto.setAccount(accountResponse);
        }

        dto.setStatus(entity.getStatus());
        dto.setUsedDate(entity.getUsedDate());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public VoucherAccount toEntity(VoucherAccountDTO dto) {
        if (dto == null) return null;

        VoucherAccount entity = new VoucherAccount();
        entity.setId(dto.getId());

        // For creating/updating, we only need the IDs since these are references
        if (dto.getVoucher() != null) {
            entity.setIdVoucher(voucherMapper.toEntity(dto.getVoucher().getId(), null));
        }

        if (dto.getAccount() != null) {
            Account account = new Account();
            account.setId(dto.getAccount().getId());
            entity.setIdAccount(account);
        }

        entity.setStatus(dto.getStatus());
        entity.setUsedDate(dto.getUsedDate());

        return entity;
    }

    public VoucherAccount createNewVoucherAccount(Integer voucherId, Integer accountId) {
        VoucherAccount entity = new VoucherAccount();

        // Set up basic references by ID
        Account account = new Account();
        account.setId(accountId);
        entity.setIdAccount(account);

        entity.setIdVoucher(voucherMapper.toEntity(voucherId, null));

        // Set default values
        entity.setStatus(VoucherAccountStatus.NOT_USED);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        return entity;
    }
}
