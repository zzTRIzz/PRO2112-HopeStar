package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.CartDetailDto;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.mapper.CartDetailMapper;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.CartDetailService;
import com.example.be.entity.*;
import com.example.be.entity.status.StatusBill;
import com.example.be.entity.status.StatusCartDetail;
import com.example.be.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartDetailServiceImpl implements CartDetailService {

    @Autowired
    ShoppingCartRepository shoppingCartRepository;

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    BillMapper billMapper;

    @Autowired
    BillRepository billRepository;

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    BillService billService;

    @Autowired
    CartDetailMapper cartDetailMapper;

    @Autowired
    CartDetailRepository cartDetailRepository;

    @Override
    public List<CartDetail> getAll() {
        return cartDetailRepository.findAll();
    }

    @Override
    public void deleteCartDetail(Integer idCartDetail) {
       cartDetailRepository.deleteById(idCartDetail);
    }

    @Override
    public List<CartDetailDto> getAllGHCT() {
        List<CartDetail> cartDetail = cartDetailRepository.findAll();
        return cartDetail.stream().map(cartDetailMapper::mapperCartDetailDto)
                .collect(Collectors.toList());
    }


    @Override
    public List<CartDetailDto> getByidAccount(Integer idAccount) {
        List<CartDetail> cartDetail = cartDetailRepository.findByIdGH(idAccount);
        return cartDetail.stream().map(cartDetailMapper::mapperCartDetailDto)
                .collect(Collectors.toList());
    }

    @Override
    public CartDetailDto createGHCT(CartDetailDto cartDetailDto) {
//        Optional<CartDetail> optionalCartDetail  = cartDetailRepository.timKiemIdCartByIdProductDetail
//                (cartDetailDto.getIdShoppingCart(), cartDetailDto.getIdProductDetail());
//        if (optionalCartDetail.isPresent()){
//            CartDetail cartDetail = optionalCartDetail.get();
//            Integer soLuong = cartDetail.getQuantity() + cartDetail.getQuantity();
//            cartDetail.setQuantity(soLuong);
//            cartDetailRepository.save(cartDetail);
//            return cartDetailMapper.mapperCartDetailDto(cartDetail);
//        }else {
//            CartDetail savecartDetail = cartDetailMapper.entityCartDetail(cartDetailDto);
//            savecartDetail.setStatus(StatusCartDetail.pending);
//            CartDetail saveCartDetail = cartDetailRepository.save(savecartDetail);
//            return cartDetailMapper.mapperCartDetailDto(saveCartDetail);
//        }
        return null;
    }

    @Override
    public CartDetailDto updateGHCT(CartDetailDto cartDetailDto) {
        CartDetail cartDetail = cartDetailMapper.entityCartDetail(cartDetailDto);
        CartDetail saveCartDetail = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.mapperCartDetailDto(saveCartDetail);
    }

    @Override
    public CartDetailDto thayDoiTrangThai(Integer idCart, Integer idProduct){
        List<CartDetail> cartDetails = cartDetailRepository.capNhatTrangThaiGioHangChiTietTheoGH(idCart);
        if (cartDetails.isEmpty()){
            throw new RuntimeException("Không tìm thấy giỏ hàng chi tiết ");
        }
        for (CartDetail cd : cartDetails) {
            if (cd.getIdProductDetail().getId().equals(idProduct)) {
                if (cd.getStatus().equals(StatusCartDetail.selected)) {
                    cd.setStatus(StatusCartDetail.pending);
                } else {
                    cd.setStatus(StatusCartDetail.selected);
                }
                CartDetail cartDetail= cartDetailRepository.save(cd);
                return cartDetailMapper.mapperCartDetailDto(cartDetail);            }
        }
        return null;
    }

    @Override
    public BillDto thanhToanGioHang(Integer idCart){
        List<CartDetail> cartDetails  = cartDetailRepository.thanhToanGioHang(idCart,StatusCartDetail.selected);
        if (cartDetails.isEmpty()){
            throw new RuntimeException("Không tìm thấy giỏ hàng chi tiết ");
        }
        ShoppingCart shoppingCart = shoppingCartRepository.findById(idCart)
                .orElseThrow(()->new RuntimeException("Không tìm thấy ShoppingCart"));

        Account account = accountRepository.findById(shoppingCart.getIdAccount().getId())
                .orElseThrow(()->new RuntimeException("Không tìm thấy Account"));

        Bill bill = new Bill();
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        bill.setPaymentDate(now);
        bill.setBillType((byte) 1);
        bill.setStatus(StatusBill.CHO_XAC_NHAN);
        billRepository.save(bill);

        for (CartDetail cd:cartDetails) {
            BillDetail billDetail = new BillDetail();
            billDetail.setPrice(cd.getIdProductDetail().getPriceSell());
            billDetail.setQuantity(cd.getQuantity());
            BigDecimal tongTien = cd.getIdProductDetail().getPriceSell()
                    .multiply(BigDecimal.valueOf(cd.getQuantity()));
            billDetail.setTotalPrice(tongTien);
            billDetail.setIdBill(bill);
            billDetail.setIdProductDetail(cd.getIdProductDetail());
            billDetailRepository.save(billDetail);
        }

        BigDecimal tongTienBill = billDetailService.tongTienBill(bill.getId());
        bill.setIdAccount(account);
        bill.setTotalPrice(tongTienBill);
        billRepository.save(bill);
//        billService.apDungVoucherChoOnline(bill);
        Bill saveBill = billRepository.save(bill);
        return billMapper.dtoBillMapper(saveBill);
    }

//___________________________________Mua hang khong tai khoản--------------------------------------

    @Override
    public BillDto thanhToanGioHangKhongTaiKhoan(Integer idCart){
        List<CartDetail> cartDetails  = cartDetailRepository.thanhToanGioHang(idCart,StatusCartDetail.selected);
        if (cartDetails.isEmpty()){
            throw new RuntimeException("Không tìm thấy giỏ hàng chi tiết ");
        }
        Bill bill = new Bill();
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        bill.setPaymentDate(now);
        bill.setBillType((byte) 2);
        bill.setStatus(StatusBill.CHO_THANH_TOAN);
        billRepository.save(bill);

        for (CartDetail cd:cartDetails) {
            BillDetail billDetail = new BillDetail();
            billDetail.setPrice(cd.getIdProductDetail().getPriceSell());
            billDetail.setQuantity(cd.getQuantity());
            BigDecimal tongTien = cd.getIdProductDetail().getPriceSell()
                    .multiply(BigDecimal.valueOf(cd.getQuantity()));
            billDetail.setTotalPrice(tongTien);
            billDetail.setIdBill(bill);
            billDetail.setIdProductDetail(cd.getIdProductDetail());
            billDetailRepository.save(billDetail);
        }

        BigDecimal tongTienBill = billDetailService.tongTienBill(bill.getId());
//        bill.setIdAccount(account);
        bill.setTotalPrice(tongTienBill);
        bill.setTotalDue(tongTienBill);
        billRepository.save(bill);
//        billService.apDungVoucherChoOnline(bill);
        Bill saveBill = billRepository.save(bill);
        return billMapper.dtoBillMapper(saveBill);
    }
}
