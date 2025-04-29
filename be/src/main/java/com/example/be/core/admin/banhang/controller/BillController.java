package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.request.BillHistoryRequest;
import com.example.be.core.admin.banhang.respones.BillHistoryRespones;
import com.example.be.core.admin.banhang.respones.BillRespones;
import com.example.be.core.admin.banhang.service.BillHistoryService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.entity.Account;
import com.example.be.repository.BillRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/admin/bill")
public class BillController {
    @Autowired
    BillHistoryService billHistoryService;

    @Autowired
    BillService billService;

    @Autowired
    BillRepository billRepository;

    @Autowired
    AuthService authService;

    @GetMapping
    public ResponseEntity<List<?>> hienThiBillHistory() {
        List<BillHistoryRespones> billHistoryRespones = billHistoryService.hienThiBillHistory();
        return ResponseEntity.ok(billHistoryRespones);
    }

    @PostMapping("/addBillHistory")
    public ResponseEntity<?> addBillHistory(@RequestHeader(value = "Authorization", required = true) String jwt,
                                            @RequestBody BillHistoryRequest billHistoryRequest) throws Exception {
        Account account = authService.findAccountByJwt(jwt);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
        }

        billHistoryRequest.setIdNhanVien(account.getId());
        BillHistoryRespones billHistoryRespones = billHistoryService.addBillHistory(billHistoryRequest);
        return ResponseEntity.ok(billHistoryRespones);
    }



}
