package com.example.be.controller.admin.BanHang;

import com.example.be.dto.BillDetailDto;
import com.example.be.dto.BillDto;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.ProductDetail;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;
import com.example.be.service.ProductDetailService;
import com.example.be.service.ProductService;
import com.example.be.service.atribute.product.BillDetailService;
import com.example.be.service.atribute.product.BillService;
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

//    Chỉ cần có id nhân viên để gán vào bill là được
    @PostMapping("/addHoaDon")
    public ResponseEntity<BillDto> addHoaDon(@RequestBody BillDto billDto){
          BillDto billDto1= billService.createHoaDon(billDto);
         return ResponseEntity.ok(billDto1);
    }

    @PostMapping("/addHDCT")
    public ResponseEntity<BillDetailDto> addHDCT(@RequestBody BillDetailDto billDetailDto){
        ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                .orElseThrow(()->new RuntimeException("Không tim thấy sản phẩm chi tiết "));
        Bill bill =billRepository.findById(billDetailDto.getIdBill())
                .orElseThrow(()->new RuntimeException("Không tim thấy hóa đơn  "));
        BigDecimal price = productDetail.getPriceSell();
        billDetailDto.setPrice(price);
        BigDecimal total_price = price.multiply(BigDecimal.valueOf(billDetailDto.getQuantity()));
        billDetailDto.setTotalPrice(total_price);
        BillDetailDto savebillDetailDto =  billDetailService.createBillDetail(billDetailDto);

        return ResponseEntity.ok(savebillDetailDto);
    }


}
