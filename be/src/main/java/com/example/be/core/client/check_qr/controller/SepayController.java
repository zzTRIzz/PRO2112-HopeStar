package com.example.be.core.client.check_qr.controller;

import com.example.be.core.client.check_qr.service.SepayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sepay")
@CrossOrigin(origins = "*") // hoặc chỉ định domain của frontend
public class SepayController {

    @Autowired
    SepayService sepayService;

    @GetMapping("/check-payment")
    public ResponseEntity<?> checkPayment(
            @RequestParam("desc") String desc,
            @RequestParam("transaction_date_min") String date
    ) {
        try {
            boolean isPaid = sepayService.fetchTransactions(desc, date);
            return ResponseEntity.ok(Map.of("isPaid", isPaid));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
