package com.example.be.core.admin.banhang.service;


import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.admin.banhang.request.SearchBillRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Bill;

import java.util.List;

public interface BillService {

    List<SearchBill> getAllBill();

    List<SearchBill> searchBillList(SearchBillRequest searchBillRequest);

    List<BillDto> listTaiQuay();


    List<BillDto> listBillTop6();

    BillDto getByIdBill(Integer idBill);

    BillDto createHoaDonTaiQuay(BillDto billDto);

//    BillDto updateHoaDonTaiQuay(BillDto billDto);

    void addAccount(Integer idBill, Integer idAccount);

    BillDto apDungVoucher(Integer idBill, Integer idAccount);

    BillDto capNhatVoucherKhiChon(Integer idBill, Integer idVoucher);

    BillDto saveBillDto(BillDto billDto);

    BillDto getByIdHoaDon(Integer id);

    void updateHuyHoaDon(Integer idBill);

    //__________________________________________________________________________________________
    BillDto createHoaDonTaiWeb(BillDto billDto);

    void apDungVoucherChoOnline(Bill bill);

    BillDto createDatHangOnline(BillDto billDto);

    VoucherResponse hienThiVoucherTheoBill(Integer idBill);

    List<VoucherResponse> timKiemVoucherTheoAccount(Integer idBill);
}
