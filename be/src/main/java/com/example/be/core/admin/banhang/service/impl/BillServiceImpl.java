package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.respones.*;
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
import java.util.*;
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
    ImeiSoldRepository imeiSoldRepository;

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

//    @Override
//    public List<SearchBill> searchBillList(SearchBillRequest searchBillRequest) {
//        List<Bill> bills = billRepository.searchBills(searchBillRequest);
//        if (bills.isEmpty()) {
//            return new ArrayList<>();
//        } else {
//            return bills.stream().map(billMapper::getAllBillMapperDto)
//                    .sorted(Comparator.comparing(SearchBill::getPaymentDate).reversed()) // Sắp xếp giảm dần theo ngày.
//                    .collect(Collectors.toList());
//        }
//    }

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
            dto.setItemCount(itemCount);
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

        // Lấy giá trị giảm giá và phí ship, nếu null thì gán bằng 0
        BigDecimal giamGia = bill.getDiscountedTotal() != null ? bill.getDiscountedTotal() : BigDecimal.ZERO;
        BigDecimal phiShip = bill.getDeliveryFee() != null ? bill.getDeliveryFee() : BigDecimal.ZERO;

        // Tính tổng tiền cuối cùng (tổng tiền sản phẩm - giảm giá + phí ship)
        BigDecimal tongTienFinal = tongTien.subtract(giamGia).add(phiShip);
//        System.out.println("Tong tien "+tongTien);
//        System.out.println("Tong giamGia "+giamGia);
//        System.out.println("Tong phiShip "+phiShip);
//        System.out.println("Tong tongTienFinal "+tongTienFinal);
        if (tongTienFinal.compareTo(BigDecimal.ZERO) < 0) {
            tongTienFinal = BigDecimal.ZERO; // Không được âm tiền
        }

        // Cập nhật lại tổng tiền vào hóa đơn
        bill.setTotalPrice(tongTien); // Tổng tiền hàng
        bill.setTotalDue(tongTienFinal); // Tổng tiền phải trả (sau giảm giá + ship)
        billRepository.save(bill);

        return tongTien;
    }

    @Override
    public BillDto updateTotalDue(Integer idBill, BigDecimal totalDue) {
        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));

        bill.setCustomerPayment(totalDue);

        if (bill.getAmountChange().compareTo(BigDecimal.ZERO) < 0) {
            bill.setAmountChange(BigDecimal.ZERO);
        }

        Bill saveBill = billRepository.save(bill);
        return billMapper.dtoBillMapper(saveBill);
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

            if (voucher == null) {
                bill.setIdVoucher(null);
                bill.setDiscountedTotal(BigDecimal.ZERO);
                bill.setTotalDue(tongTien);
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }


            BigDecimal giamGia = voucher.getDiscountValue() != null ? voucher.getDiscountValue() : BigDecimal.ZERO;


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


    @Override
    public BillRespones findByIdBill(Integer idBill) {
        Optional<Bill> optionalBill = billRepository.findById(idBill);

        if (optionalBill.isEmpty()) {
            return null;
        }

        Bill bill = optionalBill.get();
        BillRespones billRespones = new BillRespones();

        billRespones.setId(bill.getId());
        billRespones.setCode(bill.getNameBill());
        billRespones.setIdAccount((bill.getIdAccount() != null) ? bill.getIdAccount().getId() : null);
        billRespones.setIdNhanVien((bill.getIdNhanVien() != null) ? bill.getIdNhanVien().getId() : null);
        billRespones.setFullNameNV((bill.getIdNhanVien() != null) ? bill.getIdNhanVien().getFullName() : null);
        billRespones.setIdVoucher((bill.getIdVoucher() != null) ? bill.getIdVoucher().getId() : null);
        billRespones.setCodeVoucher((bill.getIdVoucher() != null) ? bill.getIdVoucher().getCode() : null);
        billRespones.setTotalPrice(bill.getTotalPrice());
        billRespones.setCustomerPayment(bill.getCustomerPayment());
        billRespones.setAmountChange(bill.getAmountChange());
        billRespones.setDeliveryFee(bill.getDeliveryFee());
        billRespones.setTotalDue(bill.getTotalDue());
        billRespones.setCustomerRefund(bill.getCustomerRefund());
        billRespones.setDiscountedTotal(bill.getDiscountedTotal());
        billRespones.setDeliveryDate(bill.getDeliveryDate());
        billRespones.setPaymentDate(bill.getPaymentDate());
        billRespones.setBillType(bill.getBillType());
        billRespones.setStatus(bill.getStatus());
        billRespones.setAddress(bill.getAddress());
        billRespones.setEmail(bill.getEmail());
        billRespones.setPhone(bill.getPhone());
        billRespones.setNote(bill.getNote());
        billRespones.setName(bill.getName());
        billRespones.setPayment((bill.getPayment() != null) ? bill.getPayment().getId() : null);
        billRespones.setDelivery((bill.getDelivery() != null) ? bill.getDelivery().getId() : null);

        // Xử lý danh sách chi tiết hóa đơn
        List<BillDetail> billDetailList = billDetailRepository.findByIdBill(bill.getId());
        if (billDetailList != null && !billDetailList.isEmpty()) {
            List<BillDetailRespones> billDetailResponesList = new ArrayList<>();

            for (BillDetail billDetail : billDetailList) {
                BillDetailRespones detailResponse = new BillDetailRespones();
                detailResponse.setId(billDetail.getId());
                detailResponse.setPrice(billDetail.getPrice());
                detailResponse.setQuantity(billDetail.getQuantity());
                detailResponse.setTotalPrice(billDetail.getTotalPrice());
                detailResponse.setCreatedBy(billDetail.getCreatedBy());
                detailResponse.setUpdatedBy(billDetail.getUpdatedBy());

                // Set product detail
                if (billDetail.getIdProductDetail() != null) {
                    ProductDetailRespones productDetailRes = new ProductDetailRespones();
                    productDetailRes.setId(billDetail.getIdProductDetail().getId());
                    productDetailRes.setProductName(billDetail.getIdProductDetail().getProduct().getName());
                    productDetailRes.setRam(billDetail.getIdProductDetail().getRam().getCapacity());
                    productDetailRes.setRom(billDetail.getIdProductDetail().getRom().getCapacity());
                    productDetailRes.setColor(billDetail.getIdProductDetail().getColor().getName());
                    productDetailRes.setImage(billDetail.getIdProductDetail().getImageUrl());
                    productDetailRes.setPrice(billDetail.getIdProductDetail().getPrice());
                    productDetailRes.setPriceSell(billDetail.getIdProductDetail().getPriceSell());
                    detailResponse.setProductDetail(productDetailRes);
                }

                // Lấy imeiSold theo từng billDetail
                List<ImeiSold> imeiSolds = imeiSoldRepository.timkiem(billDetail.getId());
                List<ImeiSoldRespone> imeiSoldResList = imeiSolds.stream().map(imeiSold -> {
                    ImeiSoldRespone imeiSoldRespone = new ImeiSoldRespone();
                    imeiSoldRespone.setId(imeiSold.getId());
                    Imei imei = imeiSold.getId_Imei();
                    if (imei != null) {
                        ImeiRespones imeiRespones = new ImeiRespones();
                        imeiRespones.setId(imei.getId());
                        imeiRespones.setImeiCode(imei.getImeiCode());
                        imeiRespones.setBarCode(imei.getBarCode());
                        imeiRespones.setStatus(imei.getStatus());

                        imeiSoldRespone.setId_Imei(imeiRespones);
                    }
                    return imeiSoldRespone;
                }).collect(Collectors.toList());

                detailResponse.setImeiSoldRespones(imeiSoldResList);
                billDetailResponesList.add(detailResponse);
            }

            billRespones.setBillDetailResponesList(billDetailResponesList);
            billRespones.setDetailCount(billDetailList.size());
        } else {
            billRespones.setBillDetailResponesList(List.of());
            billRespones.setDetailCount(0);
        }

        return billRespones;
    }


}

