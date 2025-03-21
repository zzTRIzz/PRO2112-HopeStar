package com.example.be.core.admin.voucher.controller;


import com.example.be.core.admin.voucher.dto.request.VoucherAssignRequest;
import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.entity.Voucher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.plaf.PanelUI;
import java.util.List;

@RestController
@RequestMapping("/api/admin/voucher")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<List<VoucherResponse>> getAll() {
        List<VoucherResponse> responses = voucherService.getAll();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<VoucherResponse> add(@RequestBody VoucherRequest voucherRequest) {
        VoucherResponse response = voucherService.add(voucherRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoucherResponse> update(@PathVariable Integer id, @RequestBody VoucherRequest voucherRequest) {
        VoucherResponse response = voucherService.update(id, voucherRequest);
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

    @GetMapping("/date")
    public ResponseEntity<List<VoucherResponse>> searchByDateRange(@RequestParam String startTime, @RequestParam String endTime) {
        try {
            // Debug log
            System.out.println("Received dates - startTime: " + startTime + ", endTime: " + endTime);

            List<VoucherResponse> vouchers = voucherService.findByDate(startTime, endTime);
            return ResponseEntity.ok(vouchers);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("paged")
    public ResponseEntity<Page<VoucherResponse>> getPageVouchers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<VoucherResponse> vouchers = voucherService.phanTrang(pageable);
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Lỗi khi tải danh sách voucher: " + e.getMessage()
            );
        }
    }

    @GetMapping("/searchByCodeAndDate")
    public ResponseEntity<List<VoucherResponse>> searchByCodeAndDate(@RequestParam String code,
                                                                     @RequestParam String startTime,
                                                                     @RequestParam String endTime) {
        try {
            List<VoucherResponse> vouchers = voucherService.findByCodeAndDate(code, startTime, endTime);
            return ResponseEntity.ok(vouchers);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Có lỗi xảy ra khi tìm kiếm: " + e.getMessage());
        }
    }
    @PostMapping("/assign")
    public ResponseEntity<?> assignVoucherToCustomers(@RequestBody VoucherAssignRequest request) {
        try {
            voucherService.assignVoucherToCustomers(request.getVoucherId(), request.getCustomerIds());
            return ResponseEntity.ok("Đã thêm voucher cho khách hàng thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
