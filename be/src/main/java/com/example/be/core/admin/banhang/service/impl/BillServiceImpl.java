package com.example.be.core.admin.banhang.service.impl;

import com.example.be.core.admin.banhang.dto.BillDto;
import com.example.be.core.admin.banhang.dto.SearchBill;
import com.example.be.core.admin.banhang.mapper.BillMapper;
import com.example.be.core.admin.banhang.request.BillHistoryRequest;
import com.example.be.core.admin.banhang.request.UpdateCustomerRequest;
import com.example.be.core.admin.banhang.respones.*;
import com.example.be.core.admin.banhang.service.BillHistoryService;
import com.example.be.core.admin.banhang.service.BillService;
import com.example.be.core.admin.banhang.service.ImeiSoldService;
import com.example.be.core.admin.products_management.service.ProductDetailService;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.entity.*;
import com.example.be.entity.status.*;
import com.example.be.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

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
    VoucherAccountRepository voucherAccountRepository;

    @Autowired
    ImeiSoldService imeiSoldService;

    @Autowired
    BillHistoryService billHistoryService;

    @Autowired
    BillHistoryRepository billHistoryRepository;

    @Autowired
    ImeiRepository imeiRepository;

    @Autowired
    ProductDetailRepository productDetailRepository;

    public String generateBillCode() {
        String timePart = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        int randomPart = (int) (Math.random() * 90000) + 10000;
        return timePart + randomPart;
    }

    @Override
    public List<SearchBill> getAllBill() {
        List<Bill> bills = billRepository.findAll();
        return bills.stream().map(billMapper::getAllBillMapperDto)
                .sorted(Comparator.comparing(SearchBill::getPaymentDate).reversed()) // Sắp xếp giảm dần theo ngày.
                .collect(Collectors.toList());
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
    public BillDto createHoaDonTaiQuay(Integer idNhanVien) {
        try {
            BillDto billDto = new BillDto();
            if (idNhanVien == null) {
                throw new RuntimeException("Vui lòng đăng nhập với vai trò nhân viên");
            }
            LocalDateTime now = LocalDateTime.now();
            billDto.setPaymentDate(now);
            billDto.setBillType((byte) 0);
            billDto.setIdNhanVien(idNhanVien);
            billDto.setMaBill(generateBillCode());
            billDto.setStatus(StatusBill.CHO_THANH_TOAN);
            billDto.setNameBill("HD00" + billRepository.getNewCode());
            billDto.setPayInsurance(BigDecimal.ZERO);
            billDto.setDiscountedTotal(BigDecimal.ZERO);
            billDto.setCustomerPayment(BigDecimal.ZERO);
            billDto.setCustomerRefund(BigDecimal.ZERO);
            billDto.setTotalDue(BigDecimal.ZERO);
            billDto.setTotalPrice(BigDecimal.ZERO);
            billDto.setDeliveryFee(BigDecimal.ZERO);
            billDto.setAmountChange(BigDecimal.ZERO);
            Bill bill = billMapper.entityBillMapper(billDto);

            Bill savedBill = billRepository.save(bill);

            BillHistoryRequest billHistoryRequest = new BillHistoryRequest();
            billHistoryRequest.setIdBill(savedBill.getId());
            billHistoryRequest.setNote("Tạo hóa đơn thành công");
            billHistoryRequest.setActionType(StartusBillHistory.CHO_THANH_TOAN);
            billHistoryRequest.setIdNhanVien(idNhanVien);
            billHistoryService.addBillHistory(billHistoryRequest);


            return billMapper.dtoBillMapper(savedBill);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo hóa đơn: " + e.getMessage(), e);
        }
    }


    @Override
    public BigDecimal tongTienBill(Integer idBill) {

        Bill bill = billRepository.findById(idBill)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn: " + idBill));

        BigDecimal tongTien = billDetailRepository.getTotalAmountByBillId(idBill);

        BigDecimal giamGia = bill.getDiscountedTotal() != null ? bill.getDiscountedTotal() : BigDecimal.ZERO;
        BigDecimal phiShip = bill.getDeliveryFee() != null ? bill.getDeliveryFee() : BigDecimal.ZERO;
        BigDecimal baoHiem = bill.getPayInsurance() != null ? bill.getPayInsurance() : BigDecimal.ZERO;

        BigDecimal tongTienFinal = tongTien.subtract(giamGia).add(phiShip).add(baoHiem);

        if (tongTienFinal.compareTo(BigDecimal.ZERO) < 0) {
            tongTienFinal = BigDecimal.ZERO;

        }

        bill.setTotalPrice(tongTien);
        bill.setTotalDue(tongTienFinal);
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
        LocalDateTime now = LocalDateTime.now();
        bill.setReceiptDate(now);
        Bill saveBill = billRepository.save(bill);
        return billMapper.dtoBillMapper(saveBill);
    }


    @Override
    public BillDto addAccount(Integer idBill, Integer idAccount) {
        try {

            Bill bill = billRepository.findById(idBill)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));

            Account accountKhachHang = accountRepository.findById(idAccount)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng " + idAccount));
            if (accountKhachHang.getStatus() == StatusCommon.IN_ACTIVE) {
                String message = "Tài khoản khách hàng " + accountKhachHang.getFullName() + " đã bị khóa";
                throw new RuntimeException(message);
            }
            bill.setIdAccount(accountKhachHang);
            bill.setName(accountKhachHang.getFullName());
            bill.setEmail(accountKhachHang.getEmail());
            bill.setAddress(accountKhachHang.getAddress());
            bill.setPhone(accountKhachHang.getPhone());
            Bill saveBill = billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public BillDto capNhatVoucherKhiChon(Integer idBill, Voucher newVoucher) {
        try {
            Bill bill = billRepository.findById(idBill)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn " + idBill));


            BigDecimal tongTien = bill.getTotalPrice() != null ? bill.getTotalPrice() : BigDecimal.ZERO;


            Voucher oldVoucher = bill.getIdVoucher();


            if (tongTien.compareTo(BigDecimal.ZERO) == 0) {
//                bill.setIdVoucher(null);
                bill.setDiscountedTotal(BigDecimal.ZERO);
                bill.setTotalDue(BigDecimal.ZERO);
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }


            if (oldVoucher != null) {
                if (Boolean.FALSE.equals(oldVoucher.getIsPrivate())) {

                    int quantity = oldVoucher.getQuantity() != null ? oldVoucher.getQuantity() : 0;
                    oldVoucher.setQuantity(quantity + 1);
                    voucherRepository.save(oldVoucher);
                } else {
                    VoucherAccount va = voucherAccountRepository
                            .findByIdVoucher(oldVoucher.getId(), bill.getIdAccount().getId())
                            .orElse(null);
                    if (va != null && va.getStatus() == VoucherAccountStatus.USED) {
                        va.setStatus(VoucherAccountStatus.NOT_USED);
                        voucherAccountRepository.save(va);
                    }
                }
            }


            if (newVoucher == null) {
                bill.setIdVoucher(null);
                bill.setDiscountedTotal(BigDecimal.ZERO);
                BigDecimal phiShip = bill.getDeliveryFee() != null ? bill.getDeliveryFee() : BigDecimal.ZERO;
                BigDecimal baoHiem = bill.getPayInsurance() != null ? bill.getPayInsurance() : BigDecimal.ZERO;

                BigDecimal tongTienFinal = tongTien.add(phiShip).add(baoHiem);
                bill.setTotalDue(tongTienFinal);
                billRepository.save(bill);
                return billMapper.dtoBillMapper(bill);
            }
            if (newVoucher.getStatus() == StatusVoucher.EXPIRED || newVoucher.getQuantity() <= 0) {
                throw new RuntimeException("Voucher đã hết hạn hoặc đã hết lượt sử dụng !");
            }
            BigDecimal totalDue = bill.getTotalDue() != null ? bill.getTotalDue() : BigDecimal.ZERO;
            BigDecimal priceMin = newVoucher.getConditionPriceMin() != null ? newVoucher.getConditionPriceMin() : BigDecimal.ZERO;
            BigDecimal priceMax = newVoucher.getConditionPriceMax() != null ? newVoucher.getConditionPriceMax() : BigDecimal.valueOf(Long.MAX_VALUE);

            if (totalDue.compareTo(priceMin) < 0 || totalDue.compareTo(priceMax) > 0) {
                throw new RuntimeException("Giá trị hóa đơn không nằm trong khoảng áp dụng của voucher.");
            }

            BigDecimal giamGia;
            if (Boolean.TRUE.equals(newVoucher.getVoucherType())) {

                BigDecimal phanTram = newVoucher.getDiscountValue() != null ? newVoucher.getDiscountValue() : BigDecimal.ZERO;
                BigDecimal maxGiam = newVoucher.getMaxDiscountAmount() != null ? newVoucher.getMaxDiscountAmount() : BigDecimal.valueOf(Long.MAX_VALUE);

                BigDecimal tienGiam = tongTien.multiply(phanTram).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                giamGia = tienGiam.min(maxGiam);
            } else {
                giamGia = newVoucher.getDiscountValue() != null ? newVoucher.getDiscountValue() : BigDecimal.ZERO;
            }

            BigDecimal tongSauGiam = tongTien.subtract(giamGia);
            if (tongSauGiam.compareTo(BigDecimal.ZERO) < 0) {
                tongSauGiam = BigDecimal.ZERO;
            }


            if (Boolean.FALSE.equals(newVoucher.getIsPrivate())) {

                int currentQuantity = newVoucher.getQuantity() != null ? newVoucher.getQuantity() : 0;
                if (currentQuantity <= 0) {
                    throw new RuntimeException("Voucher đã hết lượt sử dụng");
                }
                newVoucher.setQuantity(currentQuantity - 1);
                voucherRepository.save(newVoucher);
            } else {
                VoucherAccount va = voucherAccountRepository
                        .findByIdVoucher(newVoucher.getId(), bill.getIdAccount().getId())
                        .orElse(null);
                if (va == null || va.getStatus() == VoucherAccountStatus.EXPIRED || va.getStatus() == VoucherAccountStatus.USED) {
                    throw new RuntimeException("Voucher này đã được sử dụng !");
                }
                if (va.getStatus() == VoucherAccountStatus.NOT_USED) {
                    va.setStatus(VoucherAccountStatus.USED);
                    va.setUsedDate(LocalDateTime.now());
                    voucherAccountRepository.save(va);
                }
            }

            bill.setIdVoucher(newVoucher);
            bill.setDiscountedTotal(giamGia);
            bill.setTotalDue(tongSauGiam);
            billRepository.save(bill);

            return billMapper.dtoBillMapper(bill);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
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
    public void updateHuyHoaDon(Integer idBill, String note) {
        try {
            Bill bill = billRepository.findById(idBill).orElseThrow(
                    () -> new RuntimeException("Bill not found with id:" + idBill)
            );
            System.out.println(bill);
            List<BillDetail> billDetail = billDetailRepository.findByIdBill(idBill);
            for (BillDetail bd : billDetail) {
                imeiSoldService.deleteImeiSold(bd.getId());
                productDetailService.updateSoLuongSanPham(bd.getIdProductDetail().getId(), bd.getQuantity());
                capNhatVoucherKhiChon(idBill, null);
            }
            bill.setStatus(StatusBill.DA_HUY);
            billRepository.save(bill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật hủy hóa đơn cho hóa đơn: " + e.getMessage());
        }
    }

    @Override
    public BillDto updateCustomerRequest(UpdateCustomerRequest request) {
        try {
            Bill bill = billRepository.findById(request.getId()).orElseThrow(
                    () -> new RuntimeException("Bill not found with id: " + request.getId())
            );

            BigDecimal oldFee = bill.getDeliveryFee();
            BigDecimal newFee = request.getDeliveryFee();

            // Nếu phí ship mới lớn hơn thì mới cập nhật
            if (newFee.compareTo(oldFee) > 0) {
                BigDecimal tongTien = bill.getTotalDue().subtract(oldFee).add(newFee);
                bill.setDeliveryFee(newFee);
                bill.setTotalDue(tongTien);
            }

            // Luôn cập nhật các thông tin còn lại
            bill.setAddress(request.getAddress());
            bill.setNote(request.getNote());
            bill.setPhone(request.getPhone());
            bill.setName(request.getName());

            Bill saveBill = billRepository.save(bill);
            return billMapper.dtoBillMapper(saveBill);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật thông tin khách hàng: " + e.getMessage());
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
    public BillRespones findByIdBill(Integer idBill) {
        Optional<Bill> optionalBill = billRepository.findById(idBill);

        if (optionalBill.isEmpty()) {
            return null;
        }

        Bill bill = optionalBill.get();
        BillRespones billRespones = new BillRespones();

        billRespones.setId(bill.getId());
        billRespones.setCode(bill.getCode());
        billRespones.setMaBill(bill.getMaBill());
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
        billRespones.setPayInsurance(bill.getPayInsurance());
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
                    productDetailRes.setDescriptionRom(billDetail.getIdProductDetail().getRom().getDescription());
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


        List<BillHistory> billHistories = billHistoryRepository.findBillHistoryByIdBill(bill.getId());
        if (billHistories != null && !billHistories.isEmpty()) {
            List<BillHistoryRespones> billHistoryResponesList = new ArrayList<>();
            for (BillHistory billHistory : billHistories) {
                BillHistoryRespones billHistoryRespones = new BillHistoryRespones();
                billHistoryRespones.setId(billHistory.getId());
                billHistoryRespones.setActionType(billHistory.getActionType());
                billHistoryRespones.setNote(billHistory.getNote());
                billHistoryRespones.setActionTime(billHistory.getActionTime());
                billHistoryRespones.setIdNhanVien(billHistory.getNhanVien() != null ? billHistory.getNhanVien().getId() : null);
                billHistoryRespones.setFullName(billHistory.getNhanVien() != null ? billHistory.getNhanVien().getFullName() : null);
                billHistoryResponesList.add(billHistoryRespones);
            }
            billRespones.setBillHistoryRespones(billHistoryResponesList);
        } else {
            billRespones.setBillHistoryRespones(List.of());
        }

        return billRespones;
    }

    @Scheduled(cron = "59 59 23 * * ?")
    @Transactional
    public void deleteUnpaidBillsDaily() {
        List<Bill> unpaidBills = billRepository.findBillByStatus(StatusBill.CHO_THANH_TOAN);
        System.out.println(unpaidBills);
        for (Bill bill : unpaidBills) {
            List<BillHistory> histories = billHistoryRepository.findBillHistoryByIdBill(bill.getId());
            if (!histories.isEmpty()) {
                billHistoryRepository.deleteAll(histories);
            }

            List<BillDetail> billDetailList = billDetailRepository.findByIdBill(bill.getId());
            System.out.println(billDetailList);
            for (BillDetail billDetail : billDetailList) {
                List<Imei> imeis = imeiSoldRepository.searchImeiSold(billDetail.getId());

                for (Imei imei : imeis) {
                    imei.setStatus(StatusImei.NOT_SOLD);
                }
                if (!imeis.isEmpty()) {
                    imeiRepository.saveAll(imeis);
                }
                imeiSoldRepository.deleteImeiSold(billDetail.getId());
                productDetailService.updateSoLuongSanPham(billDetail.getIdProductDetail().getId(), billDetail.getQuantity());
                capNhatVoucherKhiChon(bill.getId(), null);

            }
            billDetailRepository.deleteAll(billDetailList);
        }
        billRepository.deleteAll(unpaidBills);
    }
}

