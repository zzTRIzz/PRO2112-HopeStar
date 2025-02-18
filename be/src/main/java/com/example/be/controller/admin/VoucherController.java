package com.example.be.controller.admin;


import com.example.be.dto.request.products.VoucherRequest;
import com.example.be.dto.response.products.VoucherResponse;
import com.example.be.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
