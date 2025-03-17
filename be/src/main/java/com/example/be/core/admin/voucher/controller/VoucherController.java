package com.example.be.core.admin.voucher.controller;


import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.entity.Voucher;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/voucher")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;
    @GetMapping
    public ResponseEntity<List<VoucherResponse>> getAll(){
        List<VoucherResponse> responses = voucherService.getAll();
        return ResponseEntity.ok(responses);
    }
    @PostMapping
    public ResponseEntity<VoucherResponse> add(@RequestBody VoucherRequest voucherRequest){
        VoucherResponse response = voucherService.add(voucherRequest);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<VoucherResponse> update(@PathVariable Integer id, @RequestBody VoucherRequest voucherRequest){
        VoucherResponse response = voucherService.update(id,voucherRequest);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/search")
    public ResponseEntity<List<Voucher>> searchByCode(@RequestParam String code) {
        try {
            List<Voucher> vouchers = voucherService.findByCode(code);
            return ResponseEntity.ok(vouchers);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // Không thể trả về chuỗi nếu khai báo List<VoucherResponse>
        }
    }

    @GetMapping("/date")  // Thay vì /date-range để khớp với frontend
    public ResponseEntity<List<VoucherResponse>> searchByDateRange(@RequestParam String startTime, @RequestParam String endTime) {
        try {
            List<VoucherResponse> vouchers = voucherService.findByDate(startTime, endTime);
            return ResponseEntity.ok(vouchers);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Có lỗi xảy ra khi tìm kiếm: " + e.getMessage()
            );
        }
    }
}
