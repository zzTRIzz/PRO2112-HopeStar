package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.request.SearchBillRequest;
import com.example.be.core.admin.banhang.service.BillDetailService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.entity.*;
import com.example.be.entity.status.StatusBill;
import com.example.be.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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
        return bills.stream().map(billMapper::getAllBillMapperDto)
                .sorted(Comparator.comparing(SearchBill::getPaymentDate).reversed()) // Sắp xếp giảm dần theo ngày.
                .collect(Collectors.toList());
    }

    @Override
    public List<SearchBill> searchBillList(SearchBillRequest searchBillRequest) {
        List<Bill> bills = billRepository.searchBills(searchBillRequest);
        if (bills.isEmpty()) {
            return new ArrayList<>();
        } else {
            return bills.stream().map(billMapper::getAllBillMapperDto)
                    .sorted(Comparator.comparing(SearchBill::getPaymentDate).reversed()) // Sắp xếp giảm dần theo ngày.
                    .collect(Collectors.toList());
        }
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
        List<BillDto> dtoList = new ArrayList<>();

        for (Bill bill : billList) {
            List<BillDetail> billDetail = billDetailRepository.findByIdBill(bill.getId());
            int itemCount = billDetail.size();
            BillDto dto = billMapper.dtoBillMapper(bill);
            dto.setItemCount(itemCount); // Gán itemCount thủ công
            dtoList.add(dto);
        }

        return dtoList;
    }

    @Override
    public BillDto getByIdBill(Integer idBill) {
        // Kiểm tra hóa đơn có tồn tại không
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
        return billMapper.dtoBillMapper(bill);
    }

    @Override
    public BillDto updateStatus(Integer idBill, StatusBill status) {
        // Kiểm tra hóa đơn có tồn tại không
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
        bill.setStatus(status);
        Bill saveBill = billRepository.save(bill);
        return billMapper.dtoBillMapper(saveBill);
    }

    @Override
    public BillDto createHoaDonTaiQuay(BillDto billDto) {
        try {
            LocalDateTime now = LocalDateTime.now();
            billDto.setPaymentDate(now);
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
    public BigDecimal tongTienBill(Integer idBill) {
        // Lấy hóa đơn theo ID
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn: " + idBill));

        // Lấy tổng tiền hàng từ database
        BigDecimal tongTien = billDetailRepository.getTotalAmountByBillId(idBill);

        // Lấy giá trị giảm giá, nếu null thì gán bằng 0
        BigDecimal giamGia = bill.getDiscountedTotal() != null ? bill.getDiscountedTotal() : BigDecimal.ZERO;

        // Tính tổng tiền cuối cùng (tổng tiền sản phẩm - giảm giá)
        BigDecimal tongTienFinal = tongTien.subtract(giamGia);
        if (tongTienFinal.compareTo(BigDecimal.ZERO) < 0) {
            tongTienFinal = BigDecimal.ZERO; // Không được âm tiền
        }
        // Cập nhật lại tổng tiền vào hóa đơn
        bill.setTotalPrice(tongTien);
        bill.setTotalDue(tongTienFinal);
        billRepository.save(bill);

        return tongTien;
    }

    @Override
    public BillDto addAccount(Integer idBill, Integer idAccount) {
        try {
            // Kiểm tra hóa đơn có tồn tại không
            Bill bill = billRepository.findById(idBill)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
            // Kiểm tra khách hàng có tồn tại không
            Account accountKhachHang = accountRepository.findById(idAccount)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng " + idAccount));
            bill.setIdAccount(accountKhachHang);
            bill.setName(accountKhachHang.getFullName());
            bill.setEmail(accountKhachHang.getEmail());
            bill.setAddress(accountKhachHang.getAddress());
            bill.setPhone(accountKhachHang.getPhone());
            Bill saveBill = billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi thêm khách hàng cho hóa đơn: " + e.getMessage());
        }
    }

//    @Override
//    public BillDto capNhatVoucherKhiChon(Integer idBill, Integer idVoucher) {
//        try {
//            // Kiểm tra hóa đơn có tồn tại không
//            Bill bill = billRepository.findById(idBill)
//                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
//
//            if (idVoucher == null) {
//                bill.setTotalDue(bill.getTotalPrice()); // Không có giảm giá
//                bill.setDiscountedTotal(BigDecimal.ZERO); // Giảm giá là 0
//                bill.setIdVoucher(null); // Không áp dụng voucher
//                billRepository.save(bill);
//                return billMapper.dtoBillMapper(bill);
//            } else {
//                Voucher voucher = voucherRepository.findById(idVoucher).
//                        orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));
//                // Nếu idVoucher == null không áp dụng voucher
//                // Áp dụng giảm giá nếu có voucher
//                BigDecimal tongSauKhiGiam;
//                if (voucher == null) {
//                    tongSauKhiGiam = bill.getTotalPrice();
//                } else if (voucher.getDiscountValue().compareTo(bill.getTotalPrice()) < 0) {
//                    tongSauKhiGiam = bill.getTotalPrice().subtract(voucher.getDiscountValue());
////                voucherService.updateSoLuongVoucher(voucher.getId()); // Giảm số lượng voucher
//                } else {
//                    tongSauKhiGiam = BigDecimal.ZERO;
////                voucherService.updateSoLuongVoucher(voucher.getId());
//                }
//                BigDecimal tongTienGiamGia = bill.getTotalPrice().subtract(tongSauKhiGiam);
//                // Cập nhật lại hóa đơn với khách hàng và voucher
//                bill.setIdVoucher(voucher);
//                // Lấy phí ship (nếu null thì mặc định 0)
////                BigDecimal phiShip = bill.getDeliveryFee() != null ? bill.getDeliveryFee() : BigDecimal.ZERO;
//                // Tính tổng tiền cuối cùng (tổng tiền sản phẩm + phí ship)
////                BigDecimal tongTienFinal = tongSauKhiGiam.add(phiShip);
//                bill.setTotalDue(tongSauKhiGiam);
//                bill.setDiscountedTotal(tongTienGiamGia);
//                billRepository.save(bill);
//                return billMapper.dtoBillMapper(bill);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            throw new RuntimeException("Lỗi khi cập nhật khách hàng cho hóa đơn: " + e.getMessage());
//        }
//    }


    @Override
    public BillDto capNhatVoucherKhiChon(Integer idBill, Voucher voucher) {
        try {
            // Lấy hóa đơn
            Bill bill = billRepository.findById(idBill)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));

            BigDecimal tongTien = bill.getTotalPrice() != null ? bill.getTotalPrice() : BigDecimal.ZERO;

            // Nếu tổng tiền bằng 0 thì không được áp dụng voucher
            if (tongTien.compareTo(BigDecimal.ZERO) == 0) {
                bill.setIdVoucher(null);
                bill.setDiscountedTotal(BigDecimal.ZERO);
                bill.setTotalDue(BigDecimal.ZERO);
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }

            // Nếu không chọn voucher
            if (voucher == null) {
                bill.setIdVoucher(null);
                bill.setDiscountedTotal(BigDecimal.ZERO);
                bill.setTotalDue(tongTien);
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }

            // Lấy thông tin voucher
//            Voucher voucher = voucherRepository.findById(idVoucher)
//                    .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher " + idVoucher));

            BigDecimal giamGia = voucher.getDiscountValue() != null ? voucher.getDiscountValue() : BigDecimal.ZERO;

            // Tính tiền sau giảm, không để âm
            BigDecimal tongSauGiam = tongTien.subtract(giamGia);
            if (tongSauGiam.compareTo(BigDecimal.ZERO) < 0) {
                tongSauGiam = BigDecimal.ZERO;
            }

            BigDecimal tienGiam = tongTien.subtract(tongSauGiam);

            // Cập nhật vào hóa đơn
            bill.setIdVoucher(voucher);
            bill.setDiscountedTotal(tienGiam);
            bill.setTotalDue(tongSauGiam);
            billRepository.save(bill);

            return billMapper.dtoBillMapper(bill);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật voucher cho hóa đơn: " + e.getMessage());
        }
    }


    @Override
    public BillDto saveBillDto(BillDto billDto) {
        try {
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
            LocalDateTime now = LocalDateTime.now();
            billDto.setPaymentDate(now);
            billDto.setBillType((byte) 1);
            billDto.setStatus(StatusBill.CHO_THANH_TOAN);
            Bill bill = billMapper.entityBillMapper(billDto);
            Bill saveBill = billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi thêm hóa đơn tại web cho hóa đơn: " + e.getMessage());
        }
    }

//    @Override
//    public void apDungVoucherChoOnline(Bill bill) {
//        try {
//            LocalDateTime now = LocalDateTime.now();
//            Account accountKhachHang = accountRepository.findById(bill.getIdAccount().getId()).orElse(null);
//            Voucher voucher;
//            List<Voucher> voucherList = voucherRepository.giamGiaTotNhat(accountKhachHang.getId(), StatusVoucher.ACTIVE, now);
//            voucher = voucherList.isEmpty() ? null : voucherList.get(0);
//            BigDecimal tongSauKhiGiam;
//            if (voucher == null) {
//                tongSauKhiGiam = bill.getTotalPrice();
//                voucher = null;
//            } else if (voucher.getDiscountValue().compareTo(bill.getTotalPrice()) < 0) {
//                tongSauKhiGiam = bill.getTotalPrice().subtract(voucher.getDiscountValue());
//                voucherService.updateSoLuongVoucher(voucher.getId());
//            } else {
//                tongSauKhiGiam = BigDecimal.ZERO;
//                voucherService.updateSoLuongVoucher(voucher.getId());
//            }
//            System.out.println("voucher da tim duoc la :" + voucher);
//            bill.setIdVoucher(voucher);
//            // Lấy phí ship (nếu null thì mặc định 0)
//            BigDecimal phiShip = bill.getDeliveryFee() != null ? bill.getDeliveryFee() : BigDecimal.ZERO;
//            // Tính tổng tiền cuối cùng (tổng tiền sản phẩm + phí ship)
//            BigDecimal tongTienFinal = tongSauKhiGiam.add(phiShip);
//            bill.setTotalDue(tongTienFinal);
//            billRepository.save(bill);
//        } catch (Exception e) {
//            e.printStackTrace();
//            throw new RuntimeException("Lỗi khi cập nhật áp dụng voucher online cho hóa đơn: " + e.getMessage());
//        }
//    }

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

