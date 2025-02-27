package com.example.be.core.admin.sale.controller;

import com.example.be.core.admin.sale.dto.request.SaleRequest;
import com.example.be.core.admin.sale.dto.response.SaleResponse;
import com.example.be.core.admin.sale.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sale")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping("/list")
    public ResponseEntity<List<SaleResponse>> getAll() {
        List<SaleResponse> responses = saleService.getAll();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/add")
    public ResponseEntity<SaleResponse> add(@RequestBody SaleRequest saleRequest) {
        SaleResponse response = saleService.add(saleRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaleResponse> update(@PathVariable Integer id, @RequestBody SaleRequest saleRequest) {
        SaleResponse response = saleService.update(id, saleRequest);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        saleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
