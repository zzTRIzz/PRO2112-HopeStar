package com.example.be.service.atribute.product;

import com.example.be.dto.BillDto;
import com.example.be.entity.Bill;

import java.util.List;

public interface BillService {

    List<BillDto> getAllBill();

    List<BillDto> listTaiQuay();


    BillDto createHoaDon(BillDto billDto);

    BillDto getByIdHoaDon(Integer id);

    void updateHuyHoaDon(Integer idBill);
}
