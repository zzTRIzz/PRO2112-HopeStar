package com.example.be.core.admin.banhang.controller;

import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.products_management.service.ProductService;
import com.example.be.entity.Bill;
import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

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
    BillMapper billMapper;

    @Autowired
    BillRepository billRepository;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    ProductService productService;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @GetMapping
    public ResponseEntity<List<BillDto>> getListHoaDon(){
          List<BillDto> billDtos=  billService.getAllBill();
        return ResponseEntity.ok(billDtos);
    }
    @GetMapping("/{idBill}")
    public ResponseEntity<List<BillDetailDto>> getByHDCT(@PathVariable("idBill") Integer idBill){
          List<BillDetailDto> billDetailDtos=  billDetailService.getByIdBill(idBill);
        return ResponseEntity.ok(billDetailDtos);
    }

//    Chỉ cần có id nhân viên để gán vào bill là được
    @PostMapping("/addHoaDon")
    public ResponseEntity<BillDto> addHoaDon(@RequestBody BillDto billDto){
          BillDto billDto1= billService.createHoaDonTaiQuay(billDto);
         return ResponseEntity.ok(billDto1);
    }

//    Chỉ cần có id Khach hang  để gán vào bill là được
    @PutMapping
    public ResponseEntity<BillDto> addKhachHang(@RequestBody BillDto billDto){
          BillDto billDto1= billService.updateHoaDonTaiQuay(billDto);
         return ResponseEntity.ok(billDto1);
    }

//Đang sai vì phải select voucher ra để trừ tiền voucher ra và tính lại tổng tiền
    @PutMapping("/thanh-toan")
    public ResponseEntity<BillDto> thanhToan(@RequestBody BillDto billDto){
        BigDecimal tienThua = billDto.getCustomerPayment().subtract(billDto.getTotalDue());
        billDto.setAmountChange(tienThua);
        billDto.setStatus(StatusBill.DA_THANH_TOAN);
          BillDto saveBillDto= billService.updateHoaDonTaiQuay(billDto);
         return ResponseEntity.ok(saveBillDto);
    }


    @PostMapping("/addHDCT")
    public ResponseEntity<BillDetailDto> addHDCT(@RequestBody BillDetailDto billDetailDto){
        ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                .orElseThrow(()->new RuntimeException("Không tim thấy sản phẩm chi tiết "));

        BigDecimal price = productDetail.getPriceSell();

        billDetailDto.setPrice(price);

        BigDecimal total_price = price.multiply(BigDecimal.valueOf(billDetailDto.getQuantity()));
        billDetailDto.setTotalPrice(total_price);


        Bill bill =billRepository.findById(billDetailDto.getIdBill())
                .orElseThrow(()->new RuntimeException("Không tim thấy hóa đơn  "));

        BigDecimal tongTienBill=billDetailService.tongTienBill(bill.getId());
        System.out.println(tongTienBill);

        BillDto billDto = billMapper.dtoBillMapper(bill);

        billDto.setTotalPrice(tongTienBill);

//        boolean found = false;
//
//        BillDetailDto savebillDetailDto;
//
//        for (BillDetail bd:billDetailService.getALlThuong()) {
//            if (bd.getIdBill().equals(billDetailDto.getIdBill())
//            && bd.getIdProductDetail().equals(billDetailDto.getIdProductDetail())){
//                billDetailService.thayDoiSoLuongKhiCungSPVaHD(billDetailDto.getIdBill(),billDetailDto.getIdProductDetail(),billDetailDto.getQuantity());
//                found = true;
//                break;
//            }
//        }
//        if (!found){
        BillDetailDto savebillDetailDto=billDetailService.createBillDetail(billDetailDto);
//        }
        billService.updateTongTienHoaDon(billDto);

        return ResponseEntity.ok(savebillDetailDto);
    }




}
