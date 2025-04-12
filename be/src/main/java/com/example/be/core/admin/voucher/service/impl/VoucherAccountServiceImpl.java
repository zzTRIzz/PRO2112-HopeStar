package com.example.be.core.admin.voucher.service.impl;

import com.example.be.core.admin.voucher.dto.model.VoucherAccountDTO;
import com.example.be.core.admin.voucher.mapper.VoucherAccountMapper;
import com.example.be.core.admin.voucher.service.VoucherAccountService;
import com.example.be.entity.Voucher;
import com.example.be.entity.VoucherAccount;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.entity.status.VoucherAccountStatus;
import com.example.be.repository.VoucherAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoucherAccountServiceImpl implements VoucherAccountService {

    private final VoucherAccountRepository voucherAccountRepository;
    private final VoucherAccountMapper voucherAccountMapper;

    @Override
    public VoucherAccountDTO getVoucherAccountById(Integer id) {
        VoucherAccount voucherAccount = voucherAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher account"));
        return voucherAccountMapper.toDTO(voucherAccount);
    }

    @Override
    public VoucherAccountDTO updateStatus(Integer id, VoucherAccountStatus status) {
        VoucherAccount voucherAccount = voucherAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher account"));

        // Nếu voucher hết hạn, cập nhật trạng thái EXPIRED
        Voucher voucher = voucherAccount.getIdVoucher();
        if (voucher.getEndTime() != null && voucher.getEndTime().isBefore(LocalDateTime.now())) {
            voucherAccount.setStatus(VoucherAccountStatus.EXPIRED);
        } else {
            voucherAccount.setStatus(status);
        }

        // Nếu sử dụng voucher thì gán ngày sử dụng
        if (status == VoucherAccountStatus.USED) {
            voucherAccount.setUsedDate(LocalDateTime.now());
        }

        voucherAccount = voucherAccountRepository.save(voucherAccount);
        return voucherAccountMapper.toDTO(voucherAccount);
    }

    @Override
    public VoucherAccountDTO getVoucherAccountStatus(Integer voucherId, Integer accountId) {
        VoucherAccount voucherAccount = voucherAccountRepository
                .findByIdVoucherAndIdAccount(voucherId, accountId)
                .orElse(null);
        return voucherAccountMapper.toDTO(voucherAccount);
    }

    @Override
    public List<VoucherAccountDTO> getVoucherAccountsByVoucherId(Integer voucherId) {
        List<VoucherAccount> voucherAccounts = voucherAccountRepository.findByIdVoucherId(voucherId);
        return voucherAccounts.stream()
                .map(voucherAccountMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VoucherAccountDTO> getVoucherAccountsByAccountId(Integer accountId) {
        List<VoucherAccount> voucherAccounts = voucherAccountRepository.findByIdAccountId(accountId);
        return voucherAccounts.stream()
                .map(voucherAccountMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteVoucherAccount(Integer id) {
        voucherAccountRepository.deleteById(id);
    }

    @Override
    public List<VoucherAccountDTO> getVoucherUsageStatuses(Integer voucherId) {
        List<VoucherAccount> voucherAccounts = voucherAccountRepository.findByIdVoucherId(voucherId);
        return voucherAccounts.stream()
                .map(voucherAccountMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherAccountDTO createVoucherAccount(VoucherAccount voucherAccount) {
        // Thiết lập trạng thái khi thêm voucher vào account
        Voucher voucher = voucherAccount.getIdVoucher();

        if (voucher == null || voucher.getStatus() == null) {
            voucherAccount.setStatus(null);
        } else if (voucher.getStatus() == StatusVoucher.ACTIVE) {
            voucherAccount.setStatus(VoucherAccountStatus.NOT_USED);
        } else {
            voucherAccount.setStatus(null);
        }

        // Nếu voucher đã hết hạn
        if (voucher.getEndTime() != null && voucher.getEndTime().isBefore(LocalDateTime.now())) {
            voucherAccount.setStatus(VoucherAccountStatus.EXPIRED);
        }

        VoucherAccount saved = voucherAccountRepository.save(voucherAccount);
        return voucherAccountMapper.toDTO(saved);
    }
}
