package com.example.be.core.admin.banhang.service.impl;


import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.ProductDetailDto;
import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;
import com.example.be.core.admin.banhang.mapper.BillDetailMapper;
import com.example.be.core.admin.banhang.mapper.SearchBillDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.products_management.dto.response.ProductDetailResponse;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.Imei;
import com.example.be.entity.ProductDetail;

import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.entity.status.StatusImei;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ImeiRepository;
import com.example.be.repository.ProductDetailRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    BillDetailMapper billDetailMapper;

    @Autowired
    SearchBillDetailMapper searchBillDetailMapper;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    BillRepository billRepository;

    @Autowired
    ImeiRepository imeiRepository;


    @Override
    public List<BillDetailDto> getAllBillDetail() {
        List<BillDetail> billDetails = billDetailRepository.findAll();
        return billDetails.stream().map(billDetailMapper::dtoBillDetailMapper)
                .collect(Collectors.toList());
    }

    @Override
    public List<BillDetail> getALlThuong() {
        return billDetailRepository.findAll();
    }

    @Override
    public BillDetailDto createBillDetail(BillDetailDto billDetailDto) {
        try {
            ProductDetail productDetail = productDetailRepository.findById(billDetailDto.getIdProductDetail())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay chi tiết sản phẩm " + billDetailDto.getIdProductDetail()));
            Bill bill = billRepository.findById(billDetailDto.getIdBill())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay hóa đơn " + billDetailDto.getIdBill()));
            BillDetail billDetail = billDetailMapper.entityBillDetailMapper(billDetailDto, productDetail, bill);
            BillDetail saveBillDetail = billDetailRepository.save(billDetail);
            return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
        }
        return new BillDetailDto();
    }

    @Override
    public BillDetailDto thayDoiSoLuongKhiCungSPVaHD(Integer idBill, Integer idProductDetail, Integer SoLuong) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.
                findFirstByIdBillAndIdProductDetail(idBill, idProductDetail);
    
        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            Integer soLuongTong = billDetail.getQuantity() + SoLuong;
            BigDecimal tongTien = billDetail.getPrice()
                    .multiply(BigDecimal.valueOf(soLuongTong));
            billDetail.setQuantity(soLuongTong);
            billDetail.setTotalPrice(tongTien);
            BillDetail saveBillDetail = billDetailRepository.save(billDetail);
            return billDetailMapper.dtoBillDetailMapper(saveBillDetail);
        }
        return new BillDetailDto(); // Trả về DTO rỗng thay vì null
    }


    @Override
    public List<SearchBillDetailDto> getByIdBill(Integer idBill) {
        List<BillDetail> billDetails = billDetailRepository.findByIdBill(idBill);

        return billDetails.stream()
                .map(searchBillDetailMapper::dtoBillDetailMapper)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal tongTienBill(Integer idBill) {
        // Lấy hóa đơn theo ID
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn: " + idBill));

        // Lấy tổng tiền hàng từ database
        BigDecimal tongTien = billDetailRepository.getTotalAmountByBillId(idBill);

        // Lấy phí ship (nếu null thì mặc định 0)
//        BigDecimal phiShip = bill.getDeliveryFee() != null ? bill.getDeliveryFee() : BigDecimal.ZERO;

        // Tính tổng tiền cuối cùng (tổng tiền sản phẩm + phí ship)
//        BigDecimal tongTienFinal = tongTien.add(phiShip);

        // Cập nhật lại tổng tiền vào hóa đơn
        bill.setTotalPrice(tongTien);
        billRepository.save(bill);

        return tongTien;
    }


    @Override
    public void deleteBillDetail(Integer idBillDetail) {
        if (idBillDetail == null) {
            throw new RuntimeException("Vui long nhap id");
        }
        billDetailRepository.findById(idBillDetail)
                .orElseThrow(() -> new RuntimeException("Khong tim thay bill detail"));
        billDetailRepository.deleteById(idBillDetail);
    }


    //lấy danh sách product ra để hiển thị lên
    public ProductDetailDto productDetailDto(ProductDetail productDetail) {
        return new ProductDetailDto(
                productDetail.getId(),
                productDetail.getCode(),
                productDetail.getProduct().getName(),
                productDetail.getPriceSell(),
                productDetail.getInventoryQuantity(),
                productDetail.getStatus(),
                productDetail.getColor().getName(),
                productDetail.getRam().getCapacity(),
                productDetail.getRom().getCapacity(),
                productDetail.getImageUrl(),
                null
        );
    }

    @Override
    public List<ProductDetailDto> getAllProductDetailDto() {
        List<ProductDetail> productDetails = productDetailRepository.getAllProductDetail(ProductDetailStatus.ACTIVE);
        return productDetails.stream().map(this::productDetailDto)
                .collect(Collectors.toList());
    }


    @Override
    public ProductDetailDto quetBarCodeCHoProductTheoImei(String barCode) {
        // Tìm IMEI chưa bán
        Imei imei = imeiRepository.findImeiByImeiCode(barCode, StatusImei.NOT_SOLD);

        // Xử lý trường hợp không tìm thấy
        if (imei == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy sản phẩm hoặc IMEI đã được sử dụng"
            );
        }
        // Kiểm tra ràng buộc dữ liệu
        if (imei.getProductDetail() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thông tin sản phẩm không tồn tại cho IMEI: " + barCode
            );
        }
        // Map sang DTO và trả về
        ProductDetailDto dto = productDetailDto(imei.getProductDetail());
        dto.setIdImei(imei.getId());

        return dto;
    }
}
