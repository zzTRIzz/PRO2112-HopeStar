package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.service.impl.AccountService;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import com.example.be.core.admin.banhang.dto.*;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.request.UpdateCustomerRequest;
import com.example.be.core.admin.banhang.respones.BillRespones;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.products_management.dto.request.SearchProductRequest;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.products_management.service.ProductService;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.*;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;

import com.example.be.repository.VoucherRepository;
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

//    @GetMapping("/searchBillList")
//    public ResponseEntity<List<SearchBill>> searchBillList(@ModelAttribute SearchBillRequest searchBillRequest) {
//        List<SearchBill> billDtos = billService.searchBillList(searchBillRequest);
//        // Luôn trả về list kể cả rỗng
//        return ResponseEntity.ok(billDtos != null ? billDtos : Collections.emptyList());
//    }

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

    @GetMapping("/huyHoaDon/{idBill}")
    public ResponseEntity<?> huyHoaDon(@PathVariable("idBill") Integer idBill) {
        billService.updateHuyHoaDon(idBill);
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
        productDetailService.updateStatusProduct(billDetail.getIdProductDetail().getId());
        billService.capNhatVoucherKhiChon(idBill, bill.getIdVoucher());
        return "Delete Thanh Cong";
    }

    //    Chỉ cần có id nhân viên để gán vào bill là được
    @PostMapping("/addHoaDon")
    public ResponseEntity<?> addHoaDon(@RequestBody BillDto billDto) {
        BillDto billDto1 = billService.createHoaDonTaiQuay(billDto);
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
        BillDto saveBillDto = billService.saveBillDto(billDto);
        return ResponseEntity.ok(saveBillDto);
    }

    @PostMapping("/addHDCT")
    public ResponseEntity<?> addHDCT(@RequestBody BillDetailDto billDetailDto) {
        ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm chi tiết"));
        billDetailDto.setQuantity(0);
        BigDecimal price = productDetail.getPriceSell();
        billDetailDto.setPrice(price);
        billDetailDto.setTotalPrice(price.multiply(BigDecimal.valueOf(billDetailDto.getQuantity())));

        Bill bill = billRepository.findById(billDetailDto.getIdBill())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
        Optional<BillDetail> existingBillDetail = billDetailRepository.findFirstByIdBillAndIdProductDetail(
                billDetailDto.getIdBill(), billDetailDto.getIdProductDetail());

        BillDetailDto savebillDetailDto;
//        cộng số lượng nếu có sp và hóa đon giống nhau
        if (existingBillDetail.isPresent()) {
            savebillDetailDto = billDetailService.thayDoiSoLuongKhiCungSPVaHD(
                    billDetailDto.getIdBill(), billDetailDto.getIdProductDetail(), billDetailDto.getQuantity());
        } else {
            savebillDetailDto = billDetailService.createBillDetail(billDetailDto);
        }

        BillDto billDto = billMapper.dtoBillMapper(bill);
        billService.saveBillDto(billDto);
        billService.capNhatVoucherKhiChon(bill.getId(), bill.getIdVoucher());
        productDetailService.updateSoLuongProductDetail(billDetailDto.getIdProductDetail(), billDetailDto.getQuantity());
        productDetailService.updateStatusProduct(billDetailDto.getIdProductDetail());
        billService.tongTienBill(bill.getId());
        return ResponseEntity.ok(savebillDetailDto);
    }

    @PostMapping("/create_imei_sold/{idBill}/{idProduct}")
    public ResponseEntity<?> createImeiSold(@RequestBody ImeiSoldDto imeiSoldDto,
                                            @PathVariable("idBill") Integer idBill,
                                            @PathVariable("idProduct") Integer idProduct
    ) {
        imeiSoldService.creatImeiSold(imeiSoldDto.getIdBillDetail(),
                imeiSoldDto.getId_Imei());

        BillDetailDto billDetailDto = billDetailService.thayDoiSoLuongKhiCungSPVaHD(
                idBill, idProduct, imeiSoldDto.getId_Imei().size());
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

        BillDto billDto = billMapper.dtoBillMapper(bill);
        billService.saveBillDto(billDto);
        Integer quantyti = imeiSoldDto.getId_Imei().size();
        billService.capNhatVoucherKhiChon(idBill, bill.getIdVoucher());
        productDetailService.updateSoLuongProductDetail(idProduct, quantyti);
        productDetailService.updateStatusProduct(idProduct);
        billService.tongTienBill(idBill);
        return ResponseEntity.ok(billDetailDto);
    }

    @PostMapping("/update_imei_sold/{idBill}/{idProduct}")
    public ResponseEntity<?> updateImeiSold(@RequestBody ImeiSoldDto imeiSoldDto,
                                            @PathVariable("idBill") Integer idBill,
                                            @PathVariable("idProduct") Integer idProduct
    ) {
        BillDetail billDetail = billDetailRepository.findById(imeiSoldDto.getIdBillDetail())
                .orElseThrow(() -> new RuntimeException("Khong tim thay bill detail"));

        Integer quantyti = imeiSoldDto.getId_Imei().size() - billDetail.getQuantity();
        imeiSoldService.updateImeiSold(imeiSoldDto.getIdBillDetail(),
                imeiSoldDto.getId_Imei());
        if (-quantyti == billDetail.getQuantity()) {
            billDetailService.deleteBillDetail(imeiSoldDto.getIdBillDetail());
        } else {
            billDetailService.thayDoiSoLuongKhiCungSPVaHD(
                    idBill, idProduct, quantyti);
        }
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
        BillDto billDto = billMapper.dtoBillMapper(bill);
        billService.saveBillDto(billDto);
        billService.capNhatVoucherKhiChon(idBill, bill.getIdVoucher());
        productDetailService.updateSoLuongProductDetail(idProduct, quantyti);
        productDetailService.updateStatusProduct(idProduct);
        billService.tongTienBill(idBill);
        return ResponseEntity.ok("");
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

    @PostMapping("/updateVoucher/{idBill}/{idVoucher}")
    public ResponseEntity<?> updateVoucher(@PathVariable("idBill") Integer idBill,
                                           @PathVariable("idVoucher") Integer idVoucher) {
        Voucher voucher = voucherRepository.findById(idVoucher)
                .orElseThrow(() -> new RuntimeException("Khong tim thay voucher da chon"));
        BillDto billDto = billService.capNhatVoucherKhiChon(idBill, voucher);
        return ResponseEntity.ok(billDto);
    }

    @GetMapping("/hienThiByVoucher/{idBill}")
    public ResponseEntity<List<?>> findVoucherByAccount(@PathVariable("idBill") Integer idBill) {
        List<VoucherResponse> voucherResponse = billService.timKiemVoucherTheoAccount(idBill);
        return ResponseEntity.ok(voucherResponse);
    }
}
