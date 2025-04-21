package com.example.be.core.admin.banhang.service;


import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.admin.banhang.request.UpdateCustomerRequest;
import com.example.be.core.admin.banhang.respones.BillRespones;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Voucher;
import com.example.be.entity.status.StatusBill;

import java.math.BigDecimal;
import java.util.List;

public interface BillService {

    List<SearchBill> getAllBill();

    List<BillDto> listTaiQuay();


    List<BillDto> listBillTop6();

    BillDto getByIdBill(Integer idBill);

    BillDto updateStatus(Integer idBill, StatusBill status);


//    BillDto updateHoaDonTaiQuay(BillDto billDto);

    BillDto createHoaDonTaiQuay(Integer idNhanVien);

    BigDecimal tongTienBill(Integer idBill);

    BillDto updateTotalDue(Integer idBill, BigDecimal totalDue);

    BillDto addAccount(Integer idBill, Integer idAccount);

    BillDto capNhatVoucherKhiChon(Integer idBill, Voucher voucher);

    BillDto saveBillDto(BillDto billDto);

    BillDto getByIdHoaDon(Integer id);

    void updateHuyHoaDon(Integer idBill, String note);

    BillDto updateCustomerRequest (UpdateCustomerRequest request);

    VoucherResponse hienThiVoucherTheoBill(Integer idBill);

    BillRespones findByIdBill(Integer idBill);
}
