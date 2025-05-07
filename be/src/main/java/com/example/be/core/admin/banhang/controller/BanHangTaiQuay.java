package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.service.impl.AccountService;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import com.example.be.core.admin.banhang.dto.*;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.request.BillHistoryRequest;
import com.example.be.core.admin.banhang.request.UpdateCustomerRequest;
import com.example.be.core.admin.banhang.respones.BillRespones;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillHistoryService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.products_management.service.ProductService;
import com.example.be.core.admin.voucher.dto.response.VoucherApplyResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.entity.*;
import com.example.be.entity.status.StartusBillHistory;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.*;

import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/admin/banhang")
public class BanHangTaiQuay {
    @Autowired
    BillService billService;

    @Autowired
    AccountService accountService;

    @Autowired
    ImeiService imeiService;

    @Autowired
    ProductDetailService productDetailService;

    @Autowired
    ImeiSoldService imeiSoldService;

    @Autowired
    BillMapper billMapper;

    @Autowired
    BillRepository billRepository;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    ProductService productService;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    VoucherRepository voucherRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    AuthService authService;

    @Autowired
    VoucherService voucherService;

    @Autowired
    BillHistoryService billHistoryService;

    @GetMapping
    public ResponseEntity<List<?>> getListHoaDonTop6() {
        List<BillDto> billDtos = billService.listBillTop6();

        return ResponseEntity.ok(billDtos);
    }

    @GetMapping("/getAllBill")
    public ResponseEntity<List<?>> getALlBill() {
        List<SearchBill> billDtos = billService.getAllBill();
        return ResponseEntity.ok(billDtos);
    }

    @GetMapping("/listBill")
    public ResponseEntity<List<?>> getListHoaDonAll() {
        List<BillDto> billDtos = billService.listTaiQuay();
        return ResponseEntity.ok(billDtos);
    }

    @GetMapping("/getByBill/{idBill}")
    public ResponseEntity<?> getByIdBill(@PathVariable("idBill") Integer idBill) {
        BillRespones bill = billService.findByIdBill(idBill);
        return ResponseEntity.ok(bill);
    }

    @GetMapping("/{idBill}")
    public ResponseEntity<List<?>> getByHDCT(@PathVariable("idBill") Integer idBill) {
        List<SearchBillDetailDto> billDetailDtos = billDetailService.getByIdBill(idBill);
        return ResponseEntity.ok(billDetailDtos);
    }

    @GetMapping("/updateStatus/{idBill}/{status}")
    public ResponseEntity<?> getByHDCT(
            @PathVariable("idBill") Integer idBill,
            @PathVariable("status") StatusBill status) {
        BillDto billDto = billService.updateStatus(idBill, status);
        return ResponseEntity.ok(billDto);
    }

    @PostMapping("/huyHoaDon/{idBill}")
    public ResponseEntity<?> huyHoaDon(@PathVariable("idBill") Integer idBill,
                                       @RequestBody(required = false) String note) {
        billService.updateHuyHoaDon(idBill, note);
        return ResponseEntity.ok("Hủy hóa đơn thành công");
    }

    @DeleteMapping("/deleteBillDetail/{idBillDetail}/{idBill}")
    public String deleteBillDetail(@PathVariable("idBillDetail") Integer idBillDetail,
                                   @PathVariable("idBill") Integer idBill) {
        BillDetail billDetail = billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Khong tim thay bill detail " + idBillDetail));
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Khong tim thay bill detail " + idBillDetail));
        // Kiểm tra hóa đơn có tồn tại không
        imeiSoldService.deleteImeiSold(idBillDetail);
        billDetailService.deleteBillDetail(idBillDetail);
        billService.tongTienBill(billDetail.getIdBill().getId());
        productDetailService.updateSoLuongSanPham(billDetail.getIdProductDetail().getId(), billDetail.getQuantity());
        billService.capNhatVoucherKhiChon(idBill, bill.getIdVoucher());
        return "Delete Thanh Cong";
    }

    //    Chỉ cần có id nhân viên để gán vào bill là được
    @PostMapping("/addHoaDon")
    public ResponseEntity<?> addHoaDon(@RequestHeader(value = "Authorization") String jwt) throws Exception {

        Account account = authService.findAccountByJwt(jwt);
        BillDto billDto1 = billService.createHoaDonTaiQuay(account.getId());
        return ResponseEntity.ok(billDto1);
    }

    //    Chỉ cần có id Khach hang để gán vào bill là được
    @PutMapping("/addKhachHang")
    public ResponseEntity<?> addKhachHang(@RequestParam("idBill") Integer idBill,
                                          @RequestParam("idAccount") Integer idAccount) {
        BillDto billDto = billService.addAccount(idBill, idAccount);
//        BillDto billDto1 = billService.apDungVoucher(idBill, idAccount);
        return ResponseEntity.ok(billDto);
    }

    @PutMapping("/thanh_toan")
    public ResponseEntity<?> thanhToan(@RequestBody BillDto billDto) {
        LocalDateTime now = LocalDateTime.now();
        billDto.setPaymentDate(now);
        billDto.setReceiptDate(now);
        BillDto saveBillDto = billService.saveBillDto(billDto);

        BillHistoryRequest billHistoryRequest = new BillHistoryRequest();
        if (billDto.getIdDelivery() == 1) {
            billHistoryRequest.setNote("Đơn hàng đã thanh toán và hoàn tất");
            billHistoryRequest.setActionType(StartusBillHistory.HOAN_THANH);
        } else if (billDto.getIdDelivery() == 2 && billDto.getIdPayment() == 4) {
            billHistoryRequest.setNote("Đơn hàng đã được đặt thành công ");
            billHistoryRequest.setActionType(StartusBillHistory.CHO_XAC_NHAN);
        } else {
            billHistoryRequest.setNote("Đơn hàng đã được đặt và thanh toán thành công");
            billHistoryRequest.setActionType(StartusBillHistory.DA_XAC_NHAN);
        }
        billHistoryRequest.setIdBill(billDto.getId());
        billHistoryRequest.setIdNhanVien(billDto.getIdNhanVien());
        billHistoryService.addBillHistory(billHistoryRequest);

        return ResponseEntity.ok(saveBillDto);
    }

    @PostMapping("/add-bill-detail-and-create-imei-sold")
    public ResponseEntity<?> addBillDetailAndCreateImeiSold(@RequestBody BillDetailDto billDetailDto) {
        Bill bill = billRepository.findById(billDetailDto.getIdBill())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
        SearchBillDetailDto savebillDetailDto = billDetailService.createBillDetail(billDetailDto);
        billService.capNhatVoucherKhiChon(billDetailDto.getIdBill(), bill.getIdVoucher());
        billService.tongTienBill(billDetailDto.getIdBill());
        return ResponseEntity.ok(savebillDetailDto);
    }

    @PostMapping("/update_imei_sold/{idBill}/{idProduct}")
    public ResponseEntity<?> updateImeiSold(@RequestBody ImeiSoldDto imeiSoldDto,
                                            @PathVariable("idBill") Integer idBill,
                                            @PathVariable("idProduct") Integer idProduct
    ) {

        BillDetail billDetail = billDetailRepository.findById(imeiSoldDto.getIdBillDetail())
                .orElseThrow(() -> new RuntimeException("Khong tim thay bill detail"));
        imeiSoldService.updateImeiSold(imeiSoldDto.getIdBillDetail(),
                imeiSoldDto.getId_Imei());
        Integer quantyti = imeiSoldDto.getId_Imei().size() - billDetail.getQuantity();

        billDetailService.thayDoiSoLuongKhiCungSPVaHD(
                idBill, idProduct, quantyti);

        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

        productDetailService.capNhatSoLuongVaTrangThaiProductDetail(idProduct, quantyti);
        billService.capNhatVoucherKhiChon(idBill, bill.getIdVoucher());
        billService.tongTienBill(idBill);
        return ResponseEntity.ok("");
    }

    @PostMapping("/update-xac-nhan-imei/{idBill}/{idProductDetail}")
    public ResponseEntity<?> updateXacNhanImei(
            @RequestBody ImeiSoldDto imeiSoldDto,
            @PathVariable("idBill") Integer idBill,
            @PathVariable("idProductDetail") Integer idProductDetail
    ) {
        int quantity = imeiSoldDto.getId_Imei().size();

        imeiSoldService.creatImeiSold(imeiSoldDto.getIdBillDetail(), imeiSoldDto.getId_Imei());

        billDetailService.capNhatImeiCHoOnline(idBill, idProductDetail, quantity);

        productDetailService.capNhatSoLuongVaTrangThaiProductDetail(idProductDetail, quantity);

        billService.tongTienBill(idBill);

        return ResponseEntity.ok("Xác nhận IMEI thành công");
    }


    @PutMapping("/update-totalDue/{id}/{totalDue}")
    public ResponseEntity<BillDto> updateTotalDue(
            @PathVariable("id") Integer id,
            @PathVariable("totalDue") BigDecimal totalDue) {
        BillDto updatedBill = billService.updateTotalDue(id, totalDue);
        return ResponseEntity.ok(updatedBill);
    }

    @PutMapping("/updateCustomer")
    public ResponseEntity<BillDto> updateCustomer(@RequestBody UpdateCustomerRequest request) {
        BillDto updatedBill = billService.updateCustomerRequest(request);
        return ResponseEntity.ok(updatedBill);
    }

    @GetMapping("/product_detail")
    public ResponseEntity<List<?>> getListProductDetail(@ModelAttribute SearchProductRequest searchProductRequest) {
        List<ProductDetailDto> productDetailDto = billDetailService.getAllProductDetailDto(searchProductRequest);
        return ResponseEntity.ok(productDetailDto);
    }

    @GetMapping("/product-detail/barcode/{barCode}")
    public ResponseEntity<ProductDetailDto> quetBarCodeCHoProductTheoImei(@PathVariable String barCode) {
        System.out.println("Imei đã tìm được : " + barCode);
        ProductDetailDto productDetailDto = billDetailService.quetBarCodeCHoProductTheoImei(barCode);
        return ResponseEntity.ok(productDetailDto);
    }

    @GetMapping("/account")
    public ResponseEntity<List<?>> getAllAccount() {
        List<AccountResponse> accountResponses = accountService.getAllKhachHang();
        return ResponseEntity.ok(accountResponses);
    }

    @GetMapping("/imei/{idProductDetail}")
    public ResponseEntity<List<?>> getAllImei(@PathVariable("idProductDetail") Integer idProductDetail) {
        List<ImeiDto> accountResponses = imeiService.getAllImeiChuaBan(idProductDetail);
        return ResponseEntity.ok(accountResponses);
    }

    @GetMapping("/findImeiById/{idProductDetail}/{idBillDetail}")
    public ResponseEntity<List<?>> findImeiByIdProductDetail(@PathVariable("idProductDetail") Integer idProductDetail,
                                                             @PathVariable("idBillDetail") Integer idBillDetail) {
        List<ImeiDto> accountResponses = imeiService.findImeiByIdProductDetail(idProductDetail, idBillDetail);
        return ResponseEntity.ok(accountResponses);
    }

    @GetMapping("/findImeiByIdProductDetailDaBan/{idProductDetail}/{idBillDetail}")
    public ResponseEntity<List<?>> findImeiByIdProductDetailDaBan(@PathVariable("idProductDetail") Integer idProductDetail,
                                                                  @PathVariable("idBillDetail") Integer idBillDetail) {
        List<ImeiDto> accountResponses = imeiService.findImeiByIdProDaBan(idProductDetail, idBillDetail);
        return ResponseEntity.ok(accountResponses);
    }

    @GetMapping("/findByAccount/{idBill}")
    public ResponseEntity<?> findAccount(@PathVariable("idBill") Integer idBill) {
        AccountResponse saveAccounts = accountService.getByAccount(idBill);
        return ResponseEntity.ok(saveAccounts);
    }

    @GetMapping("/findByVoucher/{idBill}")
    public ResponseEntity<?> findVoucher(@PathVariable("idBill") Integer idBill) {
        VoucherResponse voucherResponse = billService.hienThiVoucherTheoBill(idBill);
        return ResponseEntity.ok(voucherResponse);
    }

    @PostMapping("/updateVoucher")
    public ResponseEntity<?> updateVoucher(@RequestParam("idBill") Integer idBill,
                                           @RequestParam(value = "idVoucher", required = false) Integer idVoucher) {
        Voucher voucher = null;
        if (idVoucher != null) {
            voucher = voucherRepository.findById(idVoucher)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher đã chọn"));
        }
        BillDto billDto = billService.capNhatVoucherKhiChon(idBill, voucher);
        return ResponseEntity.ok(billDto);
    }


    @GetMapping("/voucher")
    public ResponseEntity<List<VoucherApplyResponse>> getVouchers(
            @RequestParam(value = "idAccount", required = false) Integer idAccount) {

        Account account = null;
        if (idAccount != null) {
            account = accountRepository.findById(idAccount)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy account"));
        }

        List<VoucherApplyResponse> voucherApplyResponses = voucherService.getVoucherApply(account);
        return ResponseEntity.ok(voucherApplyResponses);
    }

}
