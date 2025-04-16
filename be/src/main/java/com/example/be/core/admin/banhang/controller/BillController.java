package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.respones.BillHistoryRespones;
import com.example.be.core.admin.banhang.service.BillHistoryService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/admin/bill-history")
public class BillController {
    @Autowired
    BillHistoryService billHistoryService;

    @GetMapping
    public ResponseEntity<List<?>> hienThiBillHistory() {
        List<BillHistoryRespones> billHistoryRespones = billHistoryService.hienThiBillHistory();
        return ResponseEntity.ok(billHistoryRespones);
    }

}
