package com.example.be.core.client.payment;

import com.example.be.core.client.cart.dto.request.OrderRequest;
import com.example.be.utils.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/apis/v1/payment")
public class PaymentController {
    @Autowired
    private VNPayService vnPayService;

    @PostMapping("/create-payment")
    public ResponseEntity<String> createPayment(
            @RequestBody OrderRequest orderRequest,
            HttpServletRequest request) throws UnsupportedEncodingException {

        String ipAddress = request.getRemoteAddr();
        String paymentUrl = vnPayService.createPayment(orderRequest.getTotalDue(), "Thanh toán hóa đơn", ipAddress);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> paymentReturn(
            @RequestParam Map<String, String> allParams,
            HttpServletRequest request) {

        String status = allParams.get("vnp_ResponseCode");
        String message;

        if ("00".equals(status)) {
            message = "Thanh toán thành công";
        } else {
            message = "Thanh toán thất bại";
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("code", status);
        response.put("data", allParams.toString());

        return ResponseEntity.ok(response);
    }
}
