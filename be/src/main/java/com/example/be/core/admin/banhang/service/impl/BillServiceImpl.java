package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.entity.*;
import com.example.be.entity.status.StatusBill;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class BillServiceImpl implements BillService {

//loại trạng thái bán hàng
//    0 là bán hàng tại quầy
//    1 là bán hàng trên web


    @Autowired
    BillRepository billRepository;

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    BillMapper billMapper;

    @Autowired
    VoucherService voucherService;

    @Autowired
    VoucherRepository voucherRepository;

    @Autowired
    PaymentMethodRepository paymentMethodRepository;

    @Autowired
    DeliveryMethodRepository deliveryMethodRepository;

    @Autowired
    VoucherMapper voucherMapper;

    @Autowired
    ProductDetailService productDetailService;

    @Autowired
    ImeiSoldService imeiSoldService;

    @Override
    public List<SearchBill> getAllBill() {
        List<Bill> bills = billRepository.findAll();
        return bills.stream().map(billMapper::getAllBillMapperDto).
                collect(Collectors.toList());
    }

    @Override
    public List<BillDto> listTaiQuay() {
        List<Bill> listHoaDonCTT = new ArrayList<>();
        for (Bill bill : billRepository.findAll()) {
            if (bill.getStatus().equals(StatusBill.CHO_THANH_TOAN)) {
                listHoaDonCTT.add(bill);
            }
        }
        return listHoaDonCTT.stream().map(billMapper::dtoBillMapper)
                .collect(Collectors.toList());
    }

    @Override
    public List<BillDto> listBillTop6() {
        Pageable top6 = PageRequest.of(0, 5);
        List<Bill> billList = billRepository.findTop6BillsPendingPayment(top6, StatusBill.CHO_THANH_TOAN);
        return billList.stream().map(billMapper::dtoBillMapper)
                .collect(Collectors.toList());
    }

    @Override
    public BillDto getByIdBill(Integer idBill) {
        // Kiểm tra hóa đơn có tồn tại không
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
        return billMapper.dtoBillMapper(bill);
    }

    @Override
    public BillDto createHoaDonTaiQuay(BillDto billDto) {
        try {
            // Cài đặt thông tin hóa đơn
            billDto.setBillType((byte) 0);
            billDto.setStatus(StatusBill.CHO_THANH_TOAN);
            billDto.setNameBill("HD00" + billRepository.getNewCode());
            System.out.println(billRepository.getNewCode());
//            Chuyển DTO sang Entity
            Bill bill = billMapper.entityBillMapper(billDto);
            // Lưu vào database
            Bill savedBill = billRepository.save(bill);

            // Trả về DTO
            return billMapper.dtoBillMapper(savedBill);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo hóa đơn: " + e.getMessage(), e);
        }
    }

    @Override
    public void addAccount(Integer idBill, Integer idAccount) {
        try {
            // Kiểm tra hóa đơn có tồn tại không
            Bill bill = billRepository.findById(idBill)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
            // Kiểm tra khách hàng có tồn tại không
            Account accountKhachHang = accountRepository.findById(idAccount)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng " + idAccount));
            bill.setIdAccount(accountKhachHang);
            billRepository.save(bill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi thêm khách hàng cho hóa đơn: " + e.getMessage());
        }
    }

    @Override
    public BillDto apDungVoucher(Integer idBill, Integer idAccount) {
        try {
            LocalDateTime now = LocalDateTime.now();
            // Kiểm tra hóa đơn có tồn tại không
            Bill bill = billRepository.findById(idBill)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
            // Nếu idAccount == null, không tìm khách hàng và không áp dụng voucher
            if (idAccount == null) {
                bill.setTotalDue(bill.getTotalPrice()); // Không có giảm giá
                bill.setDiscountedTotal(BigDecimal.ZERO); // Giảm giá là 0
                bill.setIdVoucher(null); // Không áp dụng voucher
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }
            // Kiểm tra khách hàng có tồn tại không
            Account accountKhachHang = accountRepository.findById(idAccount)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng " + idAccount));

            // Tìm voucher tốt nhất cho khách hàng
            List<Voucher> voucherList = voucherRepository.giamGiaTotNhat(accountKhachHang.getId(), StatusVoucher.ACTIVE, now);
            Voucher voucher = voucherList.isEmpty() ? null : voucherList.get(0);

            // Áp dụng giảm giá nếu có voucher
            BigDecimal tongSauKhiGiam;
            if (voucher == null) {
                tongSauKhiGiam = bill.getTotalPrice();
            } else if (voucher.getDiscountValue().compareTo(bill.getTotalPrice()) < 0) {
                tongSauKhiGiam = bill.getTotalPrice().subtract(voucher.getDiscountValue());
//                voucherService.updateSoLuongVoucher(voucher.getId()); // Giảm số lượng voucher
            } else {
                tongSauKhiGiam = BigDecimal.ZERO;
//                voucherService.updateSoLuongVoucher(voucher.getId());
            }
            BigDecimal tongTienGiamGia = bill.getTotalPrice().subtract(tongSauKhiGiam);
            // Cập nhật lại hóa đơn với khách hàng và voucher
            bill.setIdAccount(accountKhachHang);
            bill.setIdVoucher(voucher);
            bill.setTotalDue(tongSauKhiGiam);
            bill.setDiscountedTotal(tongTienGiamGia);
            billRepository.save(bill);
            return billMapper.dtoBillMapper(bill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật khách hàng cho hóa đơn: " + e.getMessage());
        }
    }

    @Override
    public BillDto capNhatVoucherKhiChon(Integer idBill, Integer idVoucher) {
        try {
            LocalDateTime now = LocalDateTime.now();
            // Kiểm tra hóa đơn có tồn tại không
            Bill bill = billRepository.findById(idBill)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));

            if (idVoucher == null) {
                bill.setTotalDue(bill.getTotalPrice()); // Không có giảm giá
                bill.setDiscountedTotal(BigDecimal.ZERO); // Giảm giá là 0
                bill.setIdVoucher(null); // Không áp dụng voucher
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }else {
                Voucher voucher = voucherRepository.findById(idVoucher).
                        orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
                // Nếu idVoucher == null không áp dụng voucher
                // Áp dụng giảm giá nếu có voucher
                BigDecimal tongSauKhiGiam;
                if (voucher == null) {
                    tongSauKhiGiam = bill.getTotalPrice();
                } else if (voucher.getDiscountValue().compareTo(bill.getTotalPrice()) < 0) {
                    tongSauKhiGiam = bill.getTotalPrice().subtract(voucher.getDiscountValue());
//                voucherService.updateSoLuongVoucher(voucher.getId()); // Giảm số lượng voucher
                } else {
                    tongSauKhiGiam = BigDecimal.ZERO;
//                voucherService.updateSoLuongVoucher(voucher.getId());
                }
                BigDecimal tongTienGiamGia = bill.getTotalPrice().subtract(tongSauKhiGiam);
                // Cập nhật lại hóa đơn với khách hàng và voucher
                bill.setIdVoucher(voucher);
                bill.setTotalDue(tongSauKhiGiam);
                bill.setDiscountedTotal(tongTienGiamGia);
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật khách hàng cho hóa đơn: " + e.getMessage());
        }
    }

    @Override
    public BillDto saveBillDto(BillDto billDto) {
        try {
            Instant now = Instant.now();
            billDto.setPaymentDate(now);
            billDto.setStatus(StatusBill.DA_THANH_TOAN);
            Bill bill = billMapper.entityBillMapper(billDto);
            Bill saveBill = billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật luu hóa đơn: " + e.getMessage());
        }
    }

    @Override
    public BillDto getByIdHoaDon(Integer id) {
        Bill bill = billRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Khong tim thay id " + id)
        );
        return billMapper.dtoBillMapper(bill);
    }


    @Override
    public void updateHuyHoaDon(Integer idBill) {
        try {
            Bill bill = billRepository.findById(idBill).orElseThrow(
                    () -> new RuntimeException("Bill not found with id:" + idBill)
            );
            List<BillDetail> billDetail = billDetailRepository.findByIdBill(idBill);
            for (BillDetail bd : billDetail) {
                imeiSoldService.deleteImeiSold(bd.getId());
                productDetailService.updateSoLuongSanPham(bd.getIdProductDetail().getId(), bd.getQuantity());
                productDetailService.updateStatusProduct(bd.getIdProductDetail().getId());
            }
            bill.setStatus(StatusBill.DA_HUY);
            billRepository.save(bill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật hủy hóa đơn cho hóa đơn: " + e.getMessage());
        }
    }


    //__________________________________________________________________________________________
    @Override
    public BillDto createHoaDonTaiWeb(BillDto billDto) {
        try {
            Account account = accountRepository.findById(billDto.getIdNhanVien())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien " + billDto.getIdNhanVien()));

//            BillDto newBill = new BillDto();
            Instant now = Instant.now();
            billDto.setBillType((byte) 1);
            billDto.setStatus(StatusBill.CHO_THANH_TOAN);
            billDto.setPaymentDate(now);
            Bill bill = billMapper.entityBillMapper(billDto);
            Bill saveBill = billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi thêm hóa đơn tại web cho hóa đơn: " + e.getMessage());
        }
    }

    @Override
    public void apDungVoucherChoOnline(Bill bill) {
        try {
            LocalDateTime now = LocalDateTime.now();
            Account accountKhachHang = accountRepository.findById(bill.getIdAccount().getId()).orElse(null);
            Voucher voucher;
            List<Voucher> voucherList = voucherRepository.giamGiaTotNhat(accountKhachHang.getId(), StatusVoucher.ACTIVE, now);
            voucher = voucherList.isEmpty() ? null : voucherList.get(0);
            BigDecimal tongSauKhiGiam;
            if (voucher == null) {
                tongSauKhiGiam = bill.getTotalPrice();
                voucher = null;
            } else if (voucher.getDiscountValue().compareTo(bill.getTotalPrice()) < 0) {
                tongSauKhiGiam = bill.getTotalPrice().subtract(voucher.getDiscountValue());
                voucherService.updateSoLuongVoucher(voucher.getId());
            } else {
                tongSauKhiGiam = BigDecimal.ZERO;
                voucherService.updateSoLuongVoucher(voucher.getId());
            }
            System.out.println("voucher da tim duoc la :" + voucher);
            bill.setIdVoucher(voucher);
            bill.setTotalDue(tongSauKhiGiam);
            billRepository.save(bill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật áp dụng voucher online cho hóa đơn: " + e.getMessage());
        }
    }

    @Override
    public BillDto createDatHangOnline(BillDto billDto) {
        try {
//            Account account = accountRepository.findById(billDto.getIdNhanVien())
//                    .orElseThrow(()-> new RuntimeException("Khong tim thay nhan vien " +billDto.getIdNhanVien()));
            billDto.setStatus(StatusBill.CHO_XAC_NHAN);
            Bill bill = billMapper.entityBillMapper(billDto);
            Bill saveBill = billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo hóa đơn: " + e.getMessage());
        }
    }


    @Override
    public VoucherResponse hienThiVoucherTheoBill(Integer idBill) {
        Bill bill = billRepository.findById(idBill).orElseThrow(
                () -> new RuntimeException("Bill not found with id:" + idBill));

        if (bill.getIdVoucher() != null) {
            Voucher voucher = voucherRepository.findByIdVoucher(idBill);
            return voucherMapper.toResponse(voucher);
        } else {
            return new VoucherResponse();
        }
    }

    @Override
    public List<VoucherResponse> timKiemVoucherTheoAccount(Integer idBill) {
        LocalDateTime now = LocalDateTime.now();
        Bill bill = billRepository.findById(idBill).orElseThrow(
                () -> new RuntimeException("Bill not found with id: " + idBill));

        if (bill.getIdAccount() == null) {
            return Collections.emptyList(); // Trả về danh sách rỗng thay vì null
        }

        List<Voucher> vouchers = voucherRepository.findByIdAccount(bill.getIdAccount().getId(), now);

        return vouchers.stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

}

