package com.example.be.core.admin.voucher.controller;


import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.voucher.dto.model.VoucherAccountDTO;
import com.example.be.core.admin.voucher.dto.request.EmailRequest;
import com.example.be.core.admin.voucher.dto.request.VoucherAssignRequest;
import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.CustomersResponse;
import com.example.be.core.admin.voucher.dto.response.ErrorResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.core.admin.voucher.service.VoucherAccountService;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.entity.status.VoucherAccountStatus;
import com.example.be.repository.VoucherRepository;
import com.example.be.utils.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.plaf.PanelUI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/voucher")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;
    private final VoucherAccountService voucherAccountService;
    private final EmailService emailService;
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @GetMapping("/list")
    public ResponseEntity<List<VoucherResponse>> getAll() {
        try {
            log.info("Getting all vouchers");
            List<VoucherResponse> responses = voucherService.getAll();
            log.info("Found {} vouchers", responses.size());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error getting vouchers: ", e);
            throw e;
        }
    }


    @PostMapping
    public ResponseEntity<?> add(@RequestBody VoucherRequest voucherRequest) {
        try {
            VoucherResponse response = voucherService.add(voucherRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody VoucherRequest voucherRequest) {
        try {
            // Calculate current status based on time
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startTime = voucherRequest.getStartTime();
            LocalDateTime endTime = voucherRequest.getEndTime();

            // Set status based on time
            StatusVoucher calculatedStatus;
            if (now.isBefore(startTime)) {
                calculatedStatus = StatusVoucher.UPCOMING;
            } else if (now.isAfter(endTime)) {
                calculatedStatus = StatusVoucher.EXPIRED;
            } else {
                calculatedStatus = StatusVoucher.ACTIVE;
            }

            // Update the status in the request
            voucherRequest.setStatus(calculatedStatus);

            // Process the update
            VoucherResponse response = voucherService.update(id, voucherRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

//    @Scheduled(fixedRate = 60000) // Chạy mỗi phút
//    public void updateVoucherStatuses() {
//        try {
//            voucherService.updateAllVoucherStatuses();
//        } catch (Exception e) {
//            log.error("Error updating voucher statuses: ", e);
//        }
//    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateVoucherStatus() {
        try {
//            Voucher voucher = voucherRepository.findById(id)
//                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
//
//            LocalDateTime now = LocalDateTime.now();
//            StatusVoucher newStatus;
//
//            if (now.isBefore(voucher.getStartTime())) {
//                newStatus = StatusVoucher.UPCOMING;
//            } else if (now.isAfter(voucher.getEndTime())) {
//                newStatus = StatusVoucher.EXPIRED;
//            } else {
//                newStatus = StatusVoucher.ACTIVE;
//            }
//
//            voucher.setStatus(newStatus);
//            voucherRepository.save(voucher);

            voucherService.updateAllVoucherStatuses();

            return ResponseEntity.ok("Cập nhật thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check-code")
    public ResponseEntity<Boolean> checkCode(@RequestParam String code) {
        try {
            boolean exists = voucherService.isCodeExists(code);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(true);
        }
    }

    @GetMapping("/check-code-update")
    public ResponseEntity<Boolean> checkCodeForUpdate(
            @RequestParam String code,
            @RequestParam Integer id
    ) {
        try {
            boolean exists = voucherService.isCodeExistsForUpdate(code, id);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(true);
        }
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
    public ResponseData<?> assignVoucherToCustomers(@RequestBody VoucherAssignRequest request) {
        try {
            Map<String, Object> result = voucherService.assignVoucherToCustomers(
                    request.getVoucherId(),
                    request.getCustomerIds()
            );

            return new ResponseData<>(
                    HttpStatus.OK,
                    (String) result.get("message"),
                    result
            );
        } catch (Exception e) {
            log.error("Lỗi khi gán voucher:", e);
            return new ResponseData<>(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );
        }
    }

    @GetMapping("/{voucherId}/accounts")
    public ResponseData<List<AccountResponse>> getAccountsWithVoucher(@PathVariable Integer voucherId) {
        try {
            List<AccountResponse> accounts = voucherService.getAccountsWithVoucher(voucherId);
            return new ResponseData<>(
                    HttpStatus.OK,
                    "Lấy danh sách tài khoản thành công",
                    accounts
            );
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách tài khoản có voucher:", e);
            return new ResponseData<>(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    null
            );
        }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(request.getTo(), request.getSubject(), request.getContent());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<String, String>() {{
                        put("message", "Không thể gửi email: " + e.getMessage());
                    }});
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<VoucherResponse> getVoucherDetail(@PathVariable Integer id) {
        try {
            VoucherResponse voucher = voucherService.findById(id);
            if (voucher == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(voucher);
        } catch (Exception e) {
            log.error("Error getting voucher details: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail() {
        try {
            log.info("Bắt đầu test gửi email...");

            String testContent = """
                    <div style="font-family: Arial, sans-serif;">
                        <h2>Test Email từ HopeStar</h2>
                        <p>Thời gian gửi: %s</p>
                        <p>Đây là email test.</p>
                    </div>
                    """.formatted(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

            emailService.sendEmail(
                    "tringuyenquoc15102004@gmail.com",
                    "Test Email từ HopeStar",
                    testContent
            );

            return ResponseEntity.ok("Đã gửi email test thành công");
        } catch (Exception e) {
            log.error("Lỗi gửi email test: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/searchWithFilters")
    public ResponseEntity<List<VoucherResponse>> searchWithFilters(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) Boolean isPrivate,
            @RequestParam(required = false) String status
    ) {
        try {
            List<VoucherResponse> vouchers = voucherService.searchVouchers(
                    keyword,
                    startTime,
                    endTime,
                    isPrivate,
                    status
            );
            return ResponseEntity.ok(vouchers);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/voucher-account/{id}/status")
    public ResponseEntity<?> updateVoucherAccountStatus(
            @PathVariable Integer id,
            @RequestParam VoucherAccountStatus status
    ) {
        try {
            VoucherAccountDTO updated = voucherAccountService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Không thể cập nhật trạng thái: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/usage-status")
    public ResponseEntity<List<VoucherAccountDTO>> getVoucherUsageStatus(@PathVariable Integer id) {
        List<VoucherAccountDTO> statuses = voucherAccountService.getVoucherUsageStatuses(id);
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/get-account-da-add-voucher/{idVoucher}")
    public ResponseEntity<List<?>> getAccountsAddVoucherByStatus(@PathVariable Integer idVoucher) {
        List<AccountResponse> statuses = voucherAccountService.getAccountsAddVoucherByStatus(idVoucher);
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/customers/{idVoucher}")
    public ResponseData<List<?>> getCustomers(@PathVariable("idVoucher") Integer idVoucher) throws Exception {
        List<CustomersResponse> customersResponses = voucherService.getCustomers(idVoucher);
        return new ResponseData<>(HttpStatus.OK,"ok",customersResponses);
    }
}
