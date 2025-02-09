package com.example.be.service.generic;

import com.example.be.entity.Bill;

import java.util.List;

public interface BillService {
    List<Bill> getAllBill();

    List<Bill> listTaiQuay();

    void createHoaDon(Bill bill);

    void updateHuyHoaDon(Integer idBill);
}
