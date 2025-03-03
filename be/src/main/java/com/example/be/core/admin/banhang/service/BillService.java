package com.example.be.core.admin.banhang.service;


import com.example.be.core.admin.banhang.dto.BillDto;

import java.util.List;

public interface BillService {

    List<BillDto> getAllBill();

    List<BillDto> listTaiQuay();

    BillDto createHoaDonTaiQuay(BillDto billDto);

    BillDto updateHoaDonTaiQuay(BillDto billDto);

    BillDto updateTongTienHoaDon(BillDto billDto);

    BillDto getByIdHoaDon(Integer id);

    void updateHuyHoaDon(Integer idBill);

    //__________________________________________________________________________________________
    BillDto createHoaDonTaiWeb(BillDto billDto);
}
