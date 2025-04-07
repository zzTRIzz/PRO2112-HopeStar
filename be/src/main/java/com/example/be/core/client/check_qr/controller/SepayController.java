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

    //    @GetMapping("/transactions")
//    public ResponseEntity<?> getTransactions(
//            @RequestParam("transaction_date_min") String transactionDateMin
//    ) {
//        try {
//            String response = sepayService.fetchTransactions(transactionDateMin);
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi gọi Sepay: " + e.getMessage());
//        }
//    }
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
