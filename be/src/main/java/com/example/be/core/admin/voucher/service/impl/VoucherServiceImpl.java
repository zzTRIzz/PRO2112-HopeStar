package com.example.be.core.admin.voucher.service.impl;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.RoleResponse;
import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.CustomersResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherApplyResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Account;
import com.example.be.entity.Role;
import com.example.be.entity.Voucher;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.entity.VoucherAccount;
import com.example.be.entity.status.StatusCommon;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.entity.status.VoucherAccountStatus;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.RoleRepository;
import com.example.be.repository.VoucherAccountRepository;
import com.example.be.repository.VoucherRepository;
import com.example.be.core.admin.voucher.service.VoucherService;
import com.example.be.utils.EmailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherMapper voucherMapper;
    private final VoucherRepository voucherRepository;

    private final VoucherAccountRepository voucherAccountRepository;

    private final AccountRepository accountRepository;


    private final EmailService emailService;

    private final RoleRepository roleRepository;

    @Override
    public List<VoucherResponse> getAll() {
        List<Voucher> vouchers = voucherRepository.findAllOrderByIdDesc();
        return vouchers.stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse add(VoucherRequest request) {
        if (voucherRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã voucher đã tồn tại");
        }

        LocalDateTime now = LocalDateTime.now();
        if (request.getStartTime().isBefore(now)) {
            throw new RuntimeException("Ngày bắt đầu không được trước thời điểm hiện tại");
        }

        Voucher voucher = voucherMapper.toEntity(request);
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(voucher);
    }


    @Override
    public VoucherResponse update(Integer id, VoucherRequest request) {
        if (voucherRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new RuntimeException("Mã voucher đã tồn tại");
        }

        Voucher existingVoucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        StatusVoucher currentStatus = existingVoucher.getStatus();

        // Cập nhật các trường thông thường
        existingVoucher.setName(request.getName());
        existingVoucher.setMoTa(request.getMoTa());
        existingVoucher.setDiscountValue(request.getDiscountValue());
        existingVoucher.setVoucherType(request.getVoucherType());
        existingVoucher.setConditionPriceMin(request.getConditionPriceMin());
        existingVoucher.setConditionPriceMax(request.getConditionPriceMax());
        existingVoucher.setQuantity(request.getQuantity());
        existingVoucher.setIsPrivate(request.getIsPrivate());
        existingVoucher.setMaxDiscountAmount(request.getMaxDiscountAmount());

        // Xử lý startTime và endTime theo điều kiện
        if (currentStatus == StatusVoucher.UPCOMING) {
            LocalDateTime now = LocalDateTime.now();
            if (request.getStartTime().isBefore(now)) {
                throw new RuntimeException("Ngày bắt đầu không được trước thời điểm hiện tại");
            }
            existingVoucher.setStartTime(request.getStartTime());
            existingVoucher.setEndTime(request.getEndTime());
        } else {
            // ACTIVE hoặc EXPIRED
            if (!request.getStartTime().isEqual(existingVoucher.getStartTime())) {
                throw new RuntimeException("Không được phép thay đổi ngày bắt đầu khi voucher đã hoạt động hoặc đã hết hạn");
            }
            existingVoucher.setEndTime(request.getEndTime());
        }

        // Cập nhật lại trạng thái dựa vào thời gian mới
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(existingVoucher.getStartTime())) {
            existingVoucher.setStatus(StatusVoucher.UPCOMING);
        } else if (now.isAfter(existingVoucher.getEndTime())) {
            existingVoucher.setStatus(StatusVoucher.EXPIRED);
            List<VoucherAccount> list = voucherAccountRepository.findByIdVoucherAndStatus(existingVoucher,VoucherAccountStatus.NOT_USED);
            for (VoucherAccount voucherAccount: list) {
                voucherAccount.setStatus(VoucherAccountStatus.EXPIRED);
                voucherAccountRepository.save(voucherAccount);
            }
        } else {
            existingVoucher.setStatus(StatusVoucher.ACTIVE);
            List<VoucherAccount> list = voucherAccountRepository.findByIdVoucherAndStatus(existingVoucher,VoucherAccountStatus.EXPIRED);
            for (VoucherAccount voucherAccount: list) {
                voucherAccount.setStatus(VoucherAccountStatus.NOT_USED);
                voucherAccountRepository.save(voucherAccount);
            }
        }

        Voucher updatedVoucher = voucherRepository.save(existingVoucher);
        return voucherMapper.toResponse(updatedVoucher);
    }


    @Override
    public List<Voucher> findByCode(String code) {
        return voucherRepository.findByCodeContainingIgnoreCase(code);
    }

    @Override
    public List<VoucherResponse> findByDate(String startTime, String endTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            LocalDate parseStartTime = LocalDate.parse(startTime, formatter);
            LocalDate parseEndTime = LocalDate.parse(endTime, formatter);

            // Chuyển đổi thành LocalDateTime để khớp với kiểu dữ liệu của entity
            LocalDateTime startDateTime = parseStartTime.atStartOfDay(); // 00:00:00
            LocalDateTime endDateTime = parseEndTime.atTime(23, 59, 59); // 23:59:59

            // Validate ngày
            if (startDateTime.isAfter(endDateTime)) {
                throw new IllegalArgumentException("Ngày bắt đầu không được sau ngày kết thúc");
            }

            List<Voucher> vouchers = voucherRepository.findByStartTimeBetween(startDateTime, endDateTime);
            return vouchers.stream()
                    .map(voucherMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Ngày không đúng định dạng. Vui lòng nhập theo dd/MM/yyyy");
        }
    }

    @Override
    public Page<VoucherResponse> phanTrang(Pageable pageable) {
        return voucherRepository.findAll(pageable).map(voucherMapper::toResponse);
    }

    @Override
    public List<VoucherResponse> findByCodeAndDate(String code, String startTime, String endTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            LocalDate parseStartTime = LocalDate.parse(startTime, formatter);
            LocalDate parseEndTime = LocalDate.parse(endTime, formatter);

            LocalDateTime startDateTime = parseStartTime.atStartOfDay();
            LocalDateTime endDateTime = parseEndTime.atTime(23, 59, 59);

            if (startDateTime.isAfter(endDateTime)) {
                throw new IllegalArgumentException("Ngày bắt đầu không được sau ngày kết thúc");
            }

            // Loại bỏ khoảng trắng đầu cuối của code trước khi tìm kiếm
            String trimmedCode = code.trim();

            List<Voucher> vouchers = voucherRepository.findByCodeAndDateRange(
                    trimmedCode,
                    startDateTime,
                    endDateTime
            );

            return vouchers.stream()
                    .map(voucherMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Ngày không đúng định dạng. Vui lòng nhập theo dd/MM/yyyy");
        }
    }

    @Override
    public boolean isCodeExists(String code) {
        return voucherRepository.existsByCode(code);
    }

    @Override
    public boolean isCodeExistsForUpdate(String code, Integer id) {
        return voucherRepository.existsByCodeAndIdNot(code, id);
    }


//    @Override
//    @Transactional
//    public Map<String, Object> assignVoucherToCustomers(Integer voucherId, List<Integer> customerIds) {
//        try {
//            log.info("Bắt đầu cập nhật danh sách gán voucher {} cho {} khách hàng", voucherId, customerIds.size());
//
//            Voucher voucher = voucherRepository.findById(voucherId)
//                    .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));
//
//            List<Account> allAccounts = accountRepository.findAllById(customerIds);
//
//            // Lấy danh sách account hiện đang được gán voucher trong DB
//            List<VoucherAccount> currentVoucherAccounts = voucherAccountRepository.findByIdVoucherId(voucherId);
//            Set<Integer> currentAccountIds = currentVoucherAccounts.stream()
//                    .map(va -> va.getIdAccount().getId())
//                    .collect(Collectors.toSet());
//
//            // Danh sách ID được gửi lên từ frontend
//            Set<Integer> newCustomerIds = new HashSet<>(customerIds);
//
//            // 1️⃣ Những account bị xóa (có trong DB nhưng không còn trong danh sách mới)
//            Set<Integer> removedAccountIds = new HashSet<>(currentAccountIds);
//            removedAccountIds.removeAll(newCustomerIds);
//
//            // 2️⃣ Những account mới (có trong danh sách mới nhưng chưa có trong DB)
//            Set<Integer> addedAccountIds = new HashSet<>(newCustomerIds);
//            addedAccountIds.removeAll(currentAccountIds);
//
//            // 3️⃣ Những account giữ nguyên (không thay đổi)
//            Set<Integer> unchangedAccountIds = new HashSet<>(newCustomerIds);
//            unchangedAccountIds.retainAll(currentAccountIds);
//
//            List<String> newlyAssigned = new ArrayList<>();
//            List<String> alreadyAssigned = new ArrayList<>();
//            List<String> removedAssigned = new ArrayList<>();
//
//            // 1. Xử lý xóa account khỏi voucher nếu không còn trong danh sách
//            for (Integer removedId : removedAccountIds) {
//                voucherAccountRepository.deleteByVoucherIdAndAccountId(voucherId, removedId);
//                Account removedAccount = accountRepository.findById(removedId)
//                        .orElse(null);
//                if (removedAccount != null) {
//                    //add vào chõ này
//                    sendVoucherExpiredEmail(removedAccount, voucher); // Gửi email xin lỗi
//                    removedAssigned.add(removedAccount.getFullName());
//                    log.info("Đã xóa voucher của {} và gửi email xin lỗi", removedAccount.getEmail());
//                }
//            }
//
//            // 2. Xử lý thêm account mới vào voucher
//            for (Integer addedId : addedAccountIds) {
//                Account acc = accountRepository.findById(addedId)
//                        .orElseThrow(() -> new RuntimeException("Không tìm thấy account ID: " + addedId));
//
//                if (voucher.getQuantity() <= 0) {
//                    log.warn("Voucher đã hết số lượng khi gán cho {}", acc.getEmail());
//                    continue;
//                }
//
//                VoucherAccount va = new VoucherAccount();
//                va.setIdVoucher(voucher);
//                va.setIdAccount(acc);
//
//                // Xác định trạng thái voucher ban đầu
//                if (voucher.getStatus() == StatusVoucher.ACTIVE) {
//                    va.setStatus(VoucherAccountStatus.NOT_USED);
//                } else if (voucher.getStatus() == StatusVoucher.EXPIRED) {
//                    va.setStatus(VoucherAccountStatus.EXPIRED);
//                } else {
//                    va.setStatus(null); // UPCOMING
//                }
//
//                voucherAccountRepository.save(va);
//
//                newlyAssigned.add(acc.getFullName());
//                log.info("Đã gán voucher cho {}", acc.getEmail());
//
//                // Gửi email thông báo cho account mới
//                try {
//                    if (voucher.getStatus() == StatusVoucher.ACTIVE || voucher.getStatus() == StatusVoucher.UPCOMING) {
//                        sendVoucherEmail(acc, voucher);
//                    }
//                } catch (Exception e) {
//                    log.error("Lỗi khi gửi email cho {}: {}", acc.getEmail(), e.getMessage());
//                }
//
//                // Trừ số lượng
//                int quantityChange = removedAccountIds.size() - addedAccountIds.size();
//                voucher.setQuantity(voucher.getQuantity() + quantityChange);
//            }
//
//            // 3. Danh sách giữ nguyên: không cần thao tác DB, không gửi mail
//            for (Integer unchangedId : unchangedAccountIds) {
//                Account acc = accountRepository.findById(unchangedId).orElse(null);
//                if (acc != null) {
//                    alreadyAssigned.add(acc.getFullName());
//                }
//            }
//
//            // Lưu voucher sau khi cập nhật số lượng
//            voucherRepository.save(voucher);
//
//            // Kết quả trả về
//            Map<String, Object> result = new HashMap<>();
//            result.put("success", true);
//            result.put("message", buildResultMessage(alreadyAssigned, newlyAssigned));
//            result.put("details", Map.of(
//                    "unchanged", alreadyAssigned,
//                    "added", newlyAssigned,
//                    "removed", removedAssigned
//            ));
//
//            return result;
//
//        } catch (Exception e) {
//            log.error("Lỗi trong quá trình gán voucher: {}", e.getMessage(), e);
//            throw new RuntimeException("Lỗi gán voucher: " + e.getMessage());
//        }
//    }
//


    @Override
    @Transactional
    public Map<String, Object> assignVoucherToCustomers(Integer voucherId, List<Integer> customerIds) {
        try {
            log.info("Bắt đầu cập nhật danh sách gán voucher {} cho {} khách hàng", voucherId, customerIds.size());

            Voucher voucher = voucherRepository.findById(voucherId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));

            List<Account> allAccounts = accountRepository.findAllById(customerIds);

            // Danh sách account hiện tại đang được gán voucher
            List<VoucherAccount> currentVoucherAccounts = voucherAccountRepository.findByIdVoucherId(voucherId);
            Set<Integer> currentAccountIds = currentVoucherAccounts.stream()
                    .map(va -> va.getIdAccount().getId())
                    .collect(Collectors.toSet());

            Set<Integer> newCustomerIds = new HashSet<>(customerIds);

            Set<Integer> removedAccountIds = new HashSet<>(currentAccountIds);
            removedAccountIds.removeAll(newCustomerIds);

            Set<Integer> addedAccountIds = new HashSet<>(newCustomerIds);
            addedAccountIds.removeAll(currentAccountIds);

            Set<Integer> unchangedAccountIds = new HashSet<>(newCustomerIds);
            unchangedAccountIds.retainAll(currentAccountIds);

            List<String> newlyAssigned = new ArrayList<>();
            List<String> alreadyAssigned = new ArrayList<>();
            List<String> removedAssigned = new ArrayList<>();

            // 1️⃣ Xử lý xóa account
            for (Integer removedId : removedAccountIds) {
                // Tìm voucher-account để kiểm tra trạng thái
                VoucherAccount va = voucherAccountRepository.findByIdVoucherAndIdAccount(voucherId, removedId);
                if (va != null) {
                    // Nếu chưa sử dụng → cộng lại số lượng
                    if (va.getStatus() == VoucherAccountStatus.NOT_USED) {
                        voucher.setQuantity(voucher.getQuantity() + 1);
                        log.info("Hoàn lại số lượng voucher do {} chưa sử dụng", va.getIdAccount().getEmail());
                    }

                    voucherAccountRepository.delete(va);
                }

                Account removedAccount = accountRepository.findById(removedId).orElse(null);
                if (removedAccount != null) {
                    sendVoucherUnavailableEmail(removedAccount, voucher); // gửi email xin lỗi
                    removedAssigned.add(removedAccount.getFullName());
                    log.info("Đã xóa voucher của {} và gửi email", removedAccount.getEmail());
                }
            }

            // 2️⃣ Xử lý thêm account mới
            for (Integer addedId : addedAccountIds) {
                Account acc = accountRepository.findById(addedId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy account ID: " + addedId));

                if (voucher.getQuantity() <= 0) {
                    log.warn("Voucher đã hết số lượng khi gán cho {}", acc.getEmail());
                    continue;
                }

                VoucherAccount va = new VoucherAccount();
                va.setIdVoucher(voucher);
                va.setIdAccount(acc);

                if (voucher.getStatus() == StatusVoucher.ACTIVE) {
                    va.setStatus(VoucherAccountStatus.NOT_USED);
                } else if (voucher.getStatus() == StatusVoucher.EXPIRED) {
                    va.setStatus(VoucherAccountStatus.EXPIRED);
                } else {
                    va.setStatus(null); // UPCOMING
                }

                voucherAccountRepository.save(va);
                voucher.setQuantity(voucher.getQuantity() - 1); // Trừ số lượng chính xác

                newlyAssigned.add(acc.getFullName());
                log.info("Đã gán voucher cho {}", acc.getEmail());

                try {
                    if (voucher.getStatus() == StatusVoucher.ACTIVE || voucher.getStatus() == StatusVoucher.UPCOMING) {
                        sendVoucherEmail(acc, voucher);
                    }
                } catch (Exception e) {
                    log.error("Lỗi khi gửi email cho {}: {}", acc.getEmail(), e.getMessage());
                }
            }

            // 3️⃣ Không thay đổi → chỉ đưa vào danh sách trả về
            for (Integer unchangedId : unchangedAccountIds) {
                Account acc = accountRepository.findById(unchangedId).orElse(null);
                if (acc != null) {
                    alreadyAssigned.add(acc.getFullName());
                }
            }

            // Lưu lại voucher
            voucherRepository.save(voucher);

            // Trả về kết quả
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", buildResultMessage(alreadyAssigned, newlyAssigned));
            result.put("details", Map.of(
                    "unchanged", alreadyAssigned,
                    "added", newlyAssigned,
                    "removed", removedAssigned
            ));

            return result;

        } catch (Exception e) {
            log.error("Lỗi trong quá trình gán voucher: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi gán voucher: " + e.getMessage());
        }
    }





    @Override
    public List<AccountResponse> getAccountsWithVoucher(Integer voucherId) {
        return voucherAccountRepository.findByIdVoucherId(voucherId)
                .stream()
                .map(voucherAccount -> {
                    Account account = voucherAccount.getIdAccount();
                    return AccountResponse.builder()
                            .id(account.getId())
                            .fullName(account.getFullName())
                            .code(account.getCode())
                            .email(account.getEmail())
                            .phone(account.getPhone())
                            .address(account.getAddress())
                            .imageAvatar(account.getImageAvatar())
                            .status(account.getStatus().toString())
                            .idRole(RoleResponse.builder()
                                    .id(account.getIdRole().getId())
                                    .name(account.getIdRole().getName())
                                    .code(account.getIdRole().getCode())
                                    .build())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<VoucherResponse> searchVouchers(
            String keyword,
            String startTime,
            String endTime,
            Boolean isPrivate,
            String status
    ) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDateTime startDateTime = null;
            LocalDateTime endDateTime = null;

            if (startTime != null && endTime != null) {
                LocalDate parseStartTime = LocalDate.parse(startTime, formatter);
                LocalDate parseEndTime = LocalDate.parse(endTime, formatter);

                startDateTime = parseStartTime.atStartOfDay();
                endDateTime = parseEndTime.atTime(23, 59, 59);

                if (startDateTime.isAfter(endDateTime)) {
                    throw new IllegalArgumentException("Ngày bắt đầu không được sau ngày kết thúc");
                }
            }

            // Convert status string to enum
            StatusVoucher statusEnum = null;
            if (status != null && !status.isEmpty()) {
                try {
                    statusEnum = StatusVoucher.valueOf(status);
                    log.info("Searching with status: {}", statusEnum);
                } catch (IllegalArgumentException e) {
                    log.warn("Invalid status value: {}", status);
                }
            }

            List<Voucher> vouchers = voucherRepository.findByDynamicFilters(
                    keyword,
                    startDateTime,
                    endDateTime,
                    isPrivate,
                    statusEnum
            );

            log.info("Found {} vouchers matching criteria", vouchers.size());

            return vouchers.stream()
                    .map(voucherMapper::toResponse)
                    .collect(Collectors.toList());

        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Ngày không đúng định dạng (dd/MM/yyyy)");
        } catch (Exception e) {
            log.error("Lỗi tìm kiếm voucher: ", e);
            throw new RuntimeException("Lỗi tìm kiếm voucher: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void updateAllVoucherStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findAll(); // toi uu hon thi tim khong phai la EXPIRED

        for (Voucher voucher : vouchers) {

            if(now.isAfter(voucher.getStartTime()) && voucher.getStatus().equals(StatusVoucher.UPCOMING)){
                voucher.setStatus(StatusVoucher.ACTIVE);
                voucherRepository.save(voucher);
                List<VoucherAccount> list = voucherAccountRepository.findByIdVoucherAndStatus(voucher,null);
                for (VoucherAccount voucherAccount: list) {
                    voucherAccount.setStatus(VoucherAccountStatus.NOT_USED);
                    voucherAccountRepository.save(voucherAccount);
                }
            }else if(now.isAfter(voucher.getEndTime()) && voucher.getStatus().equals(StatusVoucher.ACTIVE)){
                voucher.setStatus(StatusVoucher.EXPIRED);
                voucherRepository.save(voucher);
                List<VoucherAccount> list = voucherAccountRepository.findByIdVoucherAndStatus(voucher,VoucherAccountStatus.NOT_USED);
                for (VoucherAccount voucherAccount: list) {
                    voucherAccount.setStatus(VoucherAccountStatus.EXPIRED);
                    voucherAccountRepository.save(voucherAccount);
                }
            }

        }
    }

    @Override
    public List<VoucherApplyResponse> getVoucherApply(Account account) {

        List<VoucherApplyResponse> listVoucher = new ArrayList<>();
        if (account !=null){
            List<Voucher> voucherAccountList = voucherRepository.findValidNotUsedVouchers(account);
            List<VoucherApplyResponse> listOfAccount = handlerVoucherApplyResponses(voucherAccountList);
            listVoucher.addAll(listOfAccount);
        }
        List<Voucher> voucherPublic = voucherRepository.findByIsPrivateAndQuantityGreaterThanAndStatus(false,0,StatusVoucher.ACTIVE);
        List<VoucherApplyResponse> listOfPublic = handlerVoucherApplyResponses(voucherPublic);
        listVoucher.addAll(listOfPublic);
        return listVoucher;
    }

    @Override
    public List<CustomersResponse> getCustomers(Integer voucherId) throws Exception {
         voucherRepository.findById(voucherId).orElseThrow(()->
            new Exception("Voucher không tồn tại ")
        );
//        Role role = roleRepository.findById(3).get();
//        Role role2 = roleRepository.findById(4).get();
        List<Account> list = accountRepository.getAllAccountKhachHang(StatusCommon.ACTIVE);
//        list.addAll(accountRepository.findAccountsByIdRole(role2));
        List<CustomersResponse> customersResponses = new ArrayList<>();
        for (Account account:list) {
            VoucherAccount voucherAccount = voucherAccountRepository.findByIdVoucher(voucherId,account.getId()).orElse(null);
            CustomersResponse customersResponse = new CustomersResponse();
            customersResponse.setId(account.getId());
            customersResponse.setName(account.getFullName());
            customersResponse.setEmail(account.getEmail());
            customersResponse.setPhone(account.getPhone());

            if (voucherAccount == null) {
                customersResponse.setStatus(4);
            } else if (voucherAccount.getStatus() == null) {
                customersResponse.setStatus(5);
            } else if (VoucherAccountStatus.USED.equals(voucherAccount.getStatus())) {
                customersResponse.setStatus(1);
            } else if (VoucherAccountStatus.NOT_USED.equals(voucherAccount.getStatus())) {
                customersResponse.setStatus(2);
            } else if (VoucherAccountStatus.EXPIRED.equals(voucherAccount.getStatus())) {
                customersResponse.setStatus(3);
            } else {
                customersResponse.setStatus(4);
            }

            customersResponses.add(customersResponse);
        }
        return customersResponses;
    }

    private List<VoucherApplyResponse> handlerVoucherApplyResponses(List<Voucher> voucherList){

        List<VoucherApplyResponse> list = new ArrayList<>();
        for (Voucher voucher:voucherList) {
            VoucherApplyResponse voucherApplyResponse = new VoucherApplyResponse();
            voucherApplyResponse.setId(voucher.getId());
            voucherApplyResponse.setCode(voucher.getCode());
            voucherApplyResponse.setName(voucher.getName());
            voucherApplyResponse.setValue(voucher.getDiscountValue());
            voucherApplyResponse.setType(voucher.getVoucherType());
            voucherApplyResponse.setDescription(voucher.getMoTa());
            voucherApplyResponse.setMinOrderValue(voucher.getConditionPriceMin());
            voucherApplyResponse.setMaxOrderValue(voucher.getConditionPriceMax());
            voucherApplyResponse.setMaxDiscountAmount(voucher.getMaxDiscountAmount());
            voucherApplyResponse.setQuantity(voucher.getQuantity());
            voucherApplyResponse.setIsPrivate(voucher.getIsPrivate());
            list.add(voucherApplyResponse);
        }
        return list;

    }


    private String buildResultMessage(List<String> alreadyAssigned, List<String> newlyAssigned) {
        StringBuilder message = new StringBuilder();

        if (!alreadyAssigned.isEmpty()) {
            message.append("Một số tài khoản đã có voucher này");
        }

        if (!newlyAssigned.isEmpty()) {
            if (message.length() > 0) {
                message.append(". ");
            }
            message.append("Đã thêm voucher thành công cho ")
                    .append(newlyAssigned.size())
                    .append(" tài khoản");
        }

        return message.toString();
    }


    private void sendVoucherEmail(Account account, Voucher voucher) {
        try {
            log.info("Bắt đầu gửi email voucher cho: {}", account.getEmail());

            // Format dates
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String startDate = voucher.getStartTime() != null ?
                    voucher.getStartTime().format(dateFormatter) : "N/A";
            String endDate = voucher.getEndTime() != null ?
                    voucher.getEndTime().format(dateFormatter) : "N/A";

            // Format currency values
            NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
            String discountValue = currencyFormat.format(voucher.getDiscountValue()) +
                    (voucher.getVoucherType() ? "%" : "đ");
            String minPrice = currencyFormat.format(voucher.getConditionPriceMin());

            String emailContent = String.format("""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Chào mừng bạn đến với HopeStar, %s!</h2>
            
            <p>Cảm ơn bạn đã đồng hành cùng HopeStar trong thời gian qua. Chúng tôi rất vui được thông báo rằng bạn vừa nhận được một <strong>voucher ưu đãi mới</strong> trong tài khoản của mình!</p>

            <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">✨ Thông tin chi tiết về voucher như sau:</h3>
                
                <p style="margin: 10px 0;">🔹 <strong>Mã voucher</strong>: %s</p>
                <p style="margin: 10px 0;">🔹 <strong>Tên voucher</strong>: %s</p>
                <p style="margin: 10px 0;">🔹 <strong>Giá trị</strong>: %s</p>
                <p style="margin: 10px 0;">🔹 <strong>Điều kiện áp dụng</strong>: Cho đơn hàng từ %sđ</p>
                <p style="margin: 10px 0;">🔹 <strong>Thời hạn sử dụng</strong>: Từ %s đến %s</p>
            </div>

            <p>Hãy tận dụng voucher này để tiết kiệm cho đơn hàng tiếp theo của bạn. Đừng bỏ lỡ cơ hội nhận thêm nhiều ưu đãi hấp dẫn khác trong tương lai!</p>

            <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email hoặc hotline hỗ trợ.</p>

            <div style="margin-top: 30px;">
                <p style="margin: 5px 0;">Trân trọng,<br><strong>Đội ngũ HopeStar</strong></p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
                <p style="margin: 5px 0;">📧 Email: support@hopestar.vn</p>
                <p style="margin: 5px 0;">📞 Hotline: 1900 123 456</p>
                <p style="margin: 5px 0;">🌐 Website: www.hopestar.vn</p>
            </div>
        </div>
        """,
                    account.getFullName(),
                    voucher.getCode(),
                    voucher.getName(),
                    discountValue,
                    minPrice,
                    startDate,
                    endDate
            );

            emailService.sendEmail(
                    account.getEmail(),
                    "Bạn đã nhận được Voucher mới từ HopeStar!",
                    emailContent
            );

            log.info("✓ Đã gửi email thành công đến {} cho voucher {}",
                    account.getEmail(), voucher.getCode());

        } catch (Exception e) {
            log.error("❌ Lỗi gửi email đến {}: {}", account.getEmail(), e.getMessage());
            throw new RuntimeException("Không thể gửi email thông báo voucher: " + e.getMessage());
        }
    }
    public void sendVoucherUnavailableEmail(Account account, Voucher voucher) {
        try {
            log.info("Bắt đầu gửi email voucher không còn sử dụng được cho: {}", account.getEmail());

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String endDate = voucher.getEndTime() != null ?
                    voucher.getEndTime().format(dateFormatter) : "N/A";

            String emailContent = String.format("""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #dc2626;">Thông báo về voucher không còn hiệu lực</h2>

            <p>Chào %s,</p>

            <p>Chúng tôi xin thông báo rằng voucher <strong>"%s"</strong> của bạn hiện không thể sử dụng được nữa.</p>

            <div style="background-color: #fff3f3; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;">🔹 <strong>Mã voucher</strong>: %s</p>
                <p style="margin: 10px 0;">🔹 <strong>Tên voucher</strong>: %s</p>
                <p style="margin: 10px 0;">🔹 <strong>Ngày kết thúc hiệu lực</strong>: %s</p>
            </div>

            <p>Chúng tôi rất tiếc vì sự bất tiện này. Tuy nhiên, bạn đừng lo! HopeStar luôn có nhiều chương trình khuyến mãi hấp dẫn dành cho bạn trong thời gian tới.</p>

            <p>Hãy tiếp tục đồng hành cùng chúng tôi và đón chờ những ưu đãi mới nhé!</p>

            <div style="margin-top: 30px;">
                <p style="margin: 5px 0;">Trân trọng,<br><strong>Đội ngũ HopeStar</strong></p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
                <p style="margin: 5px 0;">📧 Email: support@hopestar.vn</p>
                <p style="margin: 5px 0;">📞 Hotline: 1900 123 456</p>
                <p style="margin: 5px 0;">🌐 Website: www.hopestar.vn</p>
            </div>
        </div>
        """,
                    account.getFullName(),
                    voucher.getName(),
                    voucher.getCode(),
                    voucher.getName(),
                    endDate
            );

            emailService.sendEmail(
                    account.getEmail(),
                    "Thông báo: Voucher không còn hiệu lực",
                    emailContent
            );

            log.info("✓ Đã gửi email thông báo voucher không còn sử dụng được đến {}", account.getEmail());

        } catch (Exception e) {
            log.error("❌ Lỗi gửi email voucher không còn hiệu lực đến {}: {}", account.getEmail(), e.getMessage());
            throw new RuntimeException("Không thể gửi email thông báo voucher không còn hiệu lực: " + e.getMessage());
        }
    }


    @Override
    public VoucherResponse findById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher với id: " + id));
        return voucherMapper.toResponse(voucher);
    }
}
