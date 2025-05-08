package com.example.be.core.admin.sale.controller;

import com.example.be.core.admin.sale.dto.request.SaleDetailDeleteRequest;
import com.example.be.core.admin.sale.dto.request.SaleProductAssignRequest;
import com.example.be.core.admin.sale.dto.request.SaleRequest;
import com.example.be.core.admin.sale.dto.response.SaleDetailResponse;
import com.example.be.core.admin.sale.dto.response.SaleResponse;
import com.example.be.core.admin.sale.service.SaleService;
import com.example.be.core.client.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sale")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;
    private final AuthService authService;
    //Danh sách sale
    @GetMapping("/list")
    public ResponseEntity<List<SaleResponse>> getAll(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        List<SaleResponse> responses = saleService.getAll();
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(responses);
    }
    //Thêm sale
    @PostMapping("/add")
    public ResponseEntity<SaleResponse> add(@Valid @RequestBody SaleRequest saleRequest,@RequestHeader(value = "Authorization") String jwt) throws Exception {
        SaleResponse response = saleService.add(saleRequest);
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(response);
    }
    //Update sale
    @PutMapping("/{id}")
    public ResponseEntity<SaleResponse> update(@PathVariable Integer id, @Valid @RequestBody SaleRequest saleRequest,@RequestHeader(value = "Authorization") String jwt) throws Exception {
        SaleResponse response = saleService.update(id, saleRequest);
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(response);
    }
    //Search
    @GetMapping("/search")
    public ResponseEntity<List<SaleResponse>> searchSales(@RequestHeader(value = "Authorization") String jwt,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateEnd) throws Exception {
        List<SaleResponse> responses = saleService.searchSales(code, dateStart, dateEnd);
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/details")
    public ResponseEntity<?> deleteSaleDetails(
            @Valid @RequestBody SaleDetailDeleteRequest request,@RequestHeader(value = "Authorization") String jwt
    ) throws Exception {authService.findAccountByJwt(jwt);
        try {
            saleService.deleteSaleDetails(request.getIds());
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Xóa thành công " + request.getIds().size() + " bản ghi"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    // Gán sản phẩm vào sale
    @PostMapping("/assign-products")
    public ResponseEntity<?> assignProductsToSale(
            @RequestBody @Valid SaleProductAssignRequest request,@RequestHeader(value = "Authorization") String jwt
    ) throws Exception {
        authService.findAccountByJwt(jwt);
        try {
            Map<String, Object> result = saleService.assignProductsToSale(request);

            // Trường hợp có sản phẩm đã tồn tại
            if (!((List<?>) result.get("existing")).isEmpty()) {
                return ResponseEntity.ok()
                        .body(Map.of(
                                "success", true,
                                "message", "Thêm thành công " + ((List<?>) result.get("added")).size() + " sản phẩm. Các sản phẩm đã tồn tại: " + result.get("existing")
                        ));
            }

            return ResponseEntity.ok().body(Map.of("success", true, "message", "Thêm thành công tất cả sản phẩm"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // Lấy danh sách sản phẩm chi tiết có ở trong sale
    @GetMapping("/{saleId}/products")
    public ResponseEntity<List<SaleDetailResponse>> getProductsInSale(
            @PathVariable Integer saleId,
            @RequestHeader(value = "Authorization") String jwt
    ) throws Exception {
        List<SaleDetailResponse> responses = saleService.getProductsInSale(saleId);
        authService.findAccountByJwt(jwt);
        return ResponseEntity.ok(responses);
    }


}
