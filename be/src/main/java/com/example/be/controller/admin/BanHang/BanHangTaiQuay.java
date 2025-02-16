package com.example.be.controller.admin.BanHang;

import com.example.be.dto.BillDto;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
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

    @Autowired
    BillService billService;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    ProductService productService;

    @Autowired
    ProductDetailService productDetailService;

    @GetMapping
    public ResponseEntity<List<BillDto>> getListHoaDon(){
          List<BillDto> billDtos=  billService.getAllBill();
        return ResponseEntity.ok(billDtos);
    }

//    Chỉ cần có id nhân viên để gán vào bill là được
    @PostMapping("/addHoaDon")
    public String addHoaDon(@RequestBody BillDto billDto){
         billService.createHoaDon(billDto);
         return "Tạo hóa đơn thành công ";
    }

    @PostMapping("/addHDCT")
    public String addHDCT(BillDetail billDetail){
        BigDecimal price = billDetail.getIdProductDetail().getPriceSell();
        billDetail.setPrice(price);
        BigDecimal total_price = price.multiply(BigDecimal.valueOf(billDetail.getQuantity()));
        billDetail.setTotalPrice(total_price);
        return "Thêm hóa đơn chi tiết thành công  thành công";
    }


}
