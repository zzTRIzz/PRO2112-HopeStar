package com.example.be.core.admin.banhang.service;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.CartDetailDto;
import com.example.be.entity.Bill;
import com.example.be.entity.CartDetail;

import java.util.List;

public interface CartDetailService {

    List<CartDetail> getAll();

    void deleteCartDetail(Integer idCartDetail);

    List<CartDetailDto> getAllGHCT();

    List<CartDetailDto> getByIdGH(Integer idGH);

    CartDetailDto createGHCT(CartDetailDto cartDetailDto);

    CartDetailDto updateGHCT(CartDetailDto cartDetailDto);

    CartDetailDto thayDoiTrangThai(Integer idAcounnt, Integer idProduct);

    BillDto thanhToanGioHang(Integer idAcounnt);

    BillDto thanhToanGioHangKhongTaiKhoan(Integer idCart);
}
