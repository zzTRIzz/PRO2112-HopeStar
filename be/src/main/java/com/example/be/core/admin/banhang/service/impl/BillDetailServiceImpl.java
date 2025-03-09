package com.example.be.core.admin.banhang.service.impl;


import com.example.be.core.admin.banhang.dto.BillDetailDto;
import com.example.be.core.admin.banhang.dto.ProductDetailDto;
import com.example.be.core.admin.banhang.dto.SearchBillDetailDto;
import com.example.be.core.admin.banhang.mapper.BillDetailMapper;
import com.example.be.core.admin.banhang.mapper.SearchBillDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.entity.Bill;
import com.example.be.entity.BillDetail;
import com.example.be.entity.ProductDetail;

import com.example.be.entity.status.ProductDetailStatus;
import com.example.be.repository.BillDetailRepository;
import com.example.be.repository.BillRepository;
import com.example.be.repository.ProductDetailRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return null;
    }

    @Override
    public BillDetailDto thayDoiSoLuongKhiCungSPVaHD(Integer idBill, Integer idProductDetail, Integer SoLuong) {
        Optional<BillDetail> optionalBillDetail = billDetailRepository.
                findFirstByIdBillAndIdProductDetail(idBill, idProductDetail);

        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            Integer soLuongTong = billDetail.getQuantity() + SoLuong;
            billDetail.setQuantity(soLuongTong);
            BigDecimal tongTien = billDetail.getPrice()
                    .multiply(BigDecimal.valueOf(soLuongTong));
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
        BigDecimal tongTien = BigDecimal.ZERO; // Khởi tạo đúng cách là zero
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(()->new RuntimeException("Khong tim thay bill"+idBill));
        for (BillDetail billDetail : billDetailRepository.findAll()) {
            if (billDetail.getIdBill().getId().equals(idBill)) {
                tongTien = tongTien.add(
                        billDetail.getPrice().multiply(BigDecimal.valueOf(billDetail.getQuantity())));
            }else {
                tongTien=BigDecimal.ZERO;
            }
        }
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


    public ProductDetailDto productDetailDto(ProductDetail productDetail){
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
                productDetail.getImageUrl()
        );
    }

    @Override
    public List<ProductDetailDto> getAllProductDetailDto(){
        List<ProductDetail> productDetails = productDetailRepository.getAllProductDetail(ProductDetailStatus.ACTIVE);
            return productDetails.stream().map(this::productDetailDto)
                    .collect(Collectors.toList());
    }
}
