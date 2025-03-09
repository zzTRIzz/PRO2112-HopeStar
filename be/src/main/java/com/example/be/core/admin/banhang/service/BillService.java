package com.example.be.core.admin.banhang.service;


import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.entity.Account;
import com.example.be.entity.Bill;

import java.util.List;

public interface BillService {

    List<BillDto> getAllBill();

    List<BillDto> listTaiQuay();


    BillDto getByIdBill(Integer idBill);

    BillDto createHoaDonTaiQuay(BillDto billDto);

    BillDto updateHoaDonTaiQuay(BillDto billDto);

    void addAccount(Integer idBill, Integer idAccount);

    BillDto apDungVoucher(Integer idBill, Integer idAccount);

    BillDto updateTongTienHoaDon(BillDto billDto);

    BillDto getByIdHoaDon(Integer id);

    void updateHuyHoaDon(Integer idBill);

    //__________________________________________________________________________________________
    BillDto createHoaDonTaiWeb(BillDto billDto);

    void apDungVoucherChoOnline(Bill bill);

    BillDto createDatHangOnline(BillDto billDto);

}
