package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.ImeiSoldDto;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.products_management.service.ProductService;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/admin/banhang")
public class BanHangTaiQuay {

//    Làm lại lưu tổng tiền bên hóa đơn
//    khi add thì nên lưu bên hóa tổng tiền bill bên hóa đơn luôn
//    làm tim kiếm theo id hóa đợn để xem sản phẩm ct ở hóa dơnd ct
//      tim cách áp dụng voucher
//    số lượng thêm bao nhiêu là tùy thuộc vào bao nhiêu imei rồi mới có số lươngj


    @Autowired
    BillService billService;

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

    @GetMapping
    public ResponseEntity<List<?>> getListHoaDon() {
        List<BillDto> billDtos = billService.listTaiQuay();
        return ResponseEntity.ok(billDtos);
    }

    @GetMapping("/{idBill}")
    public ResponseEntity<List<?>> getByHDCT(@PathVariable("idBill") Integer idBill) {
        List<BillDetailDto> billDetailDtos = billDetailService.getByIdBill(idBill);
        return ResponseEntity.ok(billDetailDtos);
    }

    @GetMapping("/deleteBillDetail/{idBillDetail}")
    public String deleteBillDetail(@PathVariable("idBillDetail") Integer idBillDetail) {
        billDetailService.deleteBillDetail(idBillDetail);
        return "Delete Thanh Cong";
    }

    @GetMapping("/deleteBill/{idBill}")
    public String deleteBill(@PathVariable("idBill") Integer idBill) {
        billService.deleteBill(idBill);
        return "Delete Thanh Cong";
    }

    //    Chỉ cần có id nhân viên để gán vào bill là được
    @PostMapping("/addHoaDon")
    public ResponseEntity<?> addHoaDon(@RequestBody BillDto billDto) {
        BillDto billDto1 = billService.createHoaDonTaiQuay(billDto);
        return ResponseEntity.ok(billDto1);
    }

    //    Chỉ cần có id Khach hang để gán vào bill là được
    @PutMapping
    public ResponseEntity<?> addKhachHang(@RequestBody BillDto billDto) {
        BillDto billDto1 = billService.updateHoaDonTaiQuay(billDto);
        return ResponseEntity.ok(billDto1);
    }

    //Đang sai vì phải select voucher ra để trừ tiền voucher ra và tính lại tổng tiền
    @PutMapping("/thanh-toan")
    public ResponseEntity<?> thanhToan(@RequestBody BillDto billDto) {
        BigDecimal tienThua = billDto.getCustomerPayment().subtract(billDto.getTotalDue());
        billDto.setAmountChange(tienThua);
        billDto.setStatus(StatusBill.DA_THANH_TOAN);
        BillDto saveBillDto = billService.updateHoaDonTaiQuay(billDto);
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
        //cộng số lượng nếu có sp và hóa đon giống nhau
        if (existingBillDetail.isPresent()) {
            savebillDetailDto = billDetailService.thayDoiSoLuongKhiCungSPVaHD(
                    billDetailDto.getIdBill(), billDetailDto.getIdProductDetail(), billDetailDto.getQuantity());
        } else {
            savebillDetailDto = billDetailService.createBillDetail(billDetailDto);
        }
        BigDecimal tongTienBill = billDetailService.tongTienBill(bill.getId());
        BillDto billDto = billMapper.dtoBillMapper(bill);
        billDto.setTotalPrice(tongTienBill);
        billService.updateTongTienHoaDon(billDto);
        productDetailService.updateSoLuongProductDetail(billDetailDto.getIdProductDetail(), billDetailDto.getQuantity());
        productDetailService.updateStatusProduct(billDetailDto.getIdProductDetail());
        return ResponseEntity.ok(savebillDetailDto);
    }

    @PostMapping("/create_imei_sold")
    public ResponseEntity<?> createImeiSold(@RequestBody ImeiSoldDto imeiSoldDto) {
        BillDetailDto billDetailDto = imeiSoldService.creatImeiSold(imeiSoldDto.getIdBillDetail(),
                imeiSoldDto.getId_Imei());
        Integer quantyti = imeiSoldDto.getId_Imei().size() ;
        productDetailService.updateSoLuongProductDetail(billDetailDto.getIdProductDetail(),quantyti);
        productDetailService.updateStatusProduct(billDetailDto.getIdProductDetail());
        return ResponseEntity.ok(billDetailDto);
    }


//    @PostMapping("/addHDCT")
//    public ResponseEntity<?> addHDCT(@RequestBody BillDetailDto billDetailDto) {
//        ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
//                .orElseThrow(() -> new RuntimeException("Không tim thấy sản phẩm chi tiết "));
//
//        BigDecimal price = productDetail.getPriceSell();
//
//        billDetailDto.setPrice(price);
//
//        BigDecimal total_price = price.multiply(BigDecimal.valueOf(billDetailDto.getQuantity()));
//        billDetailDto.setTotalPrice(total_price);
//
//
//        Bill bill = billRepository.findById(billDetailDto.getIdBill())
//                .orElseThrow(() -> new RuntimeException("Không tim thấy hóa đơn  "));
//
//        BigDecimal tongTienBill = billDetailService.tongTienBill(bill.getId());
////        System.out.println(tongTienBill);
//
//        BillDto billDto = billMapper.dtoBillMapper(bill);
//
//        billDto.setTotalPrice(tongTienBill);
//
//
//        BillDetailDto savebillDetailDto;
//
//        boolean found = false;
//
//        for (BillDetail bd : billDetailService.getALlThuong()) {
//            if (Objects.equals(bd.getIdBill(), billDetailDto.getIdBill()) &&
//                    Objects.equals(bd.getIdProductDetail(), billDetailDto.getIdProductDetail())) {
////              savebillDetailDto =
//                      billDetailService.thayDoiSoLuongKhiCungSPVaHD(
//                        billDetailDto.getIdBill(), billDetailDto.getIdProductDetail(), billDetailDto.getQuantity());
//
//                found = true;
//                break;
//            }
//        }
//        if (!found) {
////           savebillDetailDto =
//                   billDetailService.createBillDetail(billDetailDto);
//        }
//        billService.updateTongTienHoaDon(billDto);
//
//        return ResponseEntity.ok("Đã Thêm Sản Phẩm Chi Tiết Thanh Công");
//    }

}
