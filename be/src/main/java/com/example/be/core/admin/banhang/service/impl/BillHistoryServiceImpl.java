package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.request.BillHistoryRequest;
import com.example.be.core.admin.banhang.respones.BillHistoryRespones;
import com.example.be.core.admin.banhang.service.BillHistoryService;
import com.example.be.entity.*;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.BillHistoryRepository;
import com.example.be.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillHistoryServiceImpl implements BillHistoryService {

    @Autowired
    BillHistoryRepository billHistoryRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    BillRepository billRepository;


    @Override
    public List<BillHistoryRespones> hienThiBillHistory() {
        List<BillHistory> billHistory = billHistoryRepository.findAll();
        return billHistory.stream()
                .map(this::entityBillHistoryToResponse)
                .collect(Collectors.toList());     }


    @Override
    public BillHistoryRespones addBillHistory(BillHistoryRequest billHistoryRequest) {
        BillHistory billHistory = entityBillHistoryMapper(billHistoryRequest);
        BillHistory saveBillHistory = billHistoryRepository.save(billHistory);
        return entityBillHistoryToResponse(saveBillHistory);
    }


    public BillHistory entityBillHistoryMapper(BillHistoryRequest billHistoryRequest) {
        Account accountNhanVien = (billHistoryRequest.getIdNhanVien() != null)
                ? accountRepository.findById(billHistoryRequest.getIdNhanVien()).orElse(null)
                : null;
        Bill bill = (billHistoryRequest.getIdBill() != null)
                ? billRepository.findById(billHistoryRequest.getIdBill()).orElse(null)
                : null;

        return new BillHistory(
                billHistoryRequest.getId(),
                billHistoryRequest.getActionType(),
                billHistoryRequest.getNote(),
                LocalDateTime.now(),
                bill,
                accountNhanVien
        );
    }

    public BillHistoryRespones entityBillHistoryToResponse(BillHistory billHistory) {
        BillHistoryRespones billHistoryResponse = new BillHistoryRespones();

        billHistoryResponse.setId(billHistory.getId());
        billHistoryResponse.setActionType(billHistory.getActionType());
        billHistoryResponse.setNote(billHistory.getNote());
        billHistoryResponse.setActionTime(billHistory.getActionTime());

        if (billHistory.getNhanVien() != null) {
            billHistoryResponse.setIdNhanVien(billHistory.getNhanVien().getId());
            billHistoryResponse.setFullName(billHistory.getNhanVien().getFullName());
        }

        return billHistoryResponse;
    }
}
