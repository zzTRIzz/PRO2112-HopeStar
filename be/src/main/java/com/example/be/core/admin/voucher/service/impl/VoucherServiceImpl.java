package com.example.be.core.admin.voucher.service.impl;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.RoleResponse;
import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherApplyResponse;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.entity.VoucherAccount;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.entity.status.VoucherAccountStatus;
import com.example.be.repository.AccountRepository;
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
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        // Update basic fields from request
        existingVoucher.setName(request.getName());
        existingVoucher.setMoTa(request.getMoTa());
        existingVoucher.setDiscountValue(request.getDiscountValue());
        existingVoucher.setVoucherType(request.getVoucherType());
        existingVoucher.setConditionPriceMin(request.getConditionPriceMin());
        existingVoucher.setConditionPriceMax(request.getConditionPriceMax());
        existingVoucher.setQuantity(request.getQuantity());
        existingVoucher.setStartTime(request.getStartTime());
        existingVoucher.setEndTime(request.getEndTime());
        existingVoucher.setIsPrivate(request.getIsPrivate());
        existingVoucher.setMaxDiscountAmount(request.getMaxDiscountAmount());

        // Update status based on current time
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = existingVoucher.getStartTime();
        LocalDateTime endTime = existingVoucher.getEndTime();

        if (now.isBefore(startTime)) {
            existingVoucher.setStatus(StatusVoucher.UPCOMING);
        } else if (now.isAfter(endTime)) {
            existingVoucher.setStatus(StatusVoucher.EXPIRED);
        } else {
            existingVoucher.setStatus(StatusVoucher.ACTIVE);
        }

        // Save updated voucher
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
    @Override
    @Transactional
    public Map<String, Object> assignVoucherToCustomers(Integer voucherId, List<Integer> customerIds) {
        try {
            log.info("Bắt đầu gán voucher {} cho {} khách hàng", voucherId, customerIds.size());

            Voucher voucher = voucherRepository.findById(voucherId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));

            // Kiểm tra số lượng voucher còn lại
            if (voucher.getQuantity() < customerIds.size()) {
                throw new RuntimeException("Số lượng voucher không đủ để phân phối");
            }

            List<Account> customers = accountRepository.findAllById(customerIds);
            List<String> alreadyAssigned = new ArrayList<>();
            List<String> newlyAssigned = new ArrayList<>();
            int successCount = 0;

            // Xác định trạng thái ban đầu của VoucherAccount dựa trên trạng thái Voucher
            VoucherAccountStatus initialStatus;
            if (voucher.getStatus() == StatusVoucher.ACTIVE) {
                initialStatus = VoucherAccountStatus.NOT_USED;
            } else {
                initialStatus = null; // For UPCOMING or EXPIRED vouchers
            }

            for (Account customer : customers) {
                try {
                    // Kiểm tra đã có voucher chưa
                    if (voucherAccountRepository.existsByIdVoucherIdAndIdAccountId(
                            voucherId, customer.getId()
                    )) {
                        log.info("Bỏ qua - {} đã có voucher này", customer.getFullName());
                        alreadyAssigned.add(customer.getFullName());
                        continue;
                    }

                    // Tạo mới VoucherAccount với trạng thái tương ứng
                    VoucherAccount voucherAccount = new VoucherAccount();
                    voucherAccount.setIdVoucher(voucher);
                    voucherAccount.setIdAccount(customer);

                    // Set initial status based on current voucher status
                    if (voucher.getStatus() == StatusVoucher.ACTIVE) {
                        voucherAccount.setStatus(VoucherAccountStatus.NOT_USED);
                    } else if (voucher.getStatus() == StatusVoucher.EXPIRED) {
                        voucherAccount.setStatus(VoucherAccountStatus.EXPIRED);
                    } else {
                        voucherAccount.setStatus(null); // For UPCOMING vouchers
                    }

                    voucherAccountRepository.save(voucherAccount);

                    successCount++;
                    newlyAssigned.add(customer.getFullName());
                    log.info("Đã gán voucher cho {} với trạng thái {}",
                            customer.getFullName(),
                            voucherAccount.getStatus());

                    // Chỉ gửi email nếu voucher đang ACTIVE
                    if (voucher.getStatus() == StatusVoucher.ACTIVE) {
                        try {
                            sendVoucherEmail(customer, voucher);
                            log.info("Đã gửi email thông báo cho {}", customer.getEmail());
                        } catch (Exception e) {
                            log.error("Lỗi gửi email cho {}: {}", customer.getEmail(), e.getMessage());
                        }
                    }

                } catch (Exception e) {
                    log.error("Lỗi xử lý cho {}: {}", customer.getFullName(), e.getMessage());
                }
            }

            // Cập nhật số lượng voucher
            if (successCount > 0) {
                voucher.setQuantity(voucher.getQuantity() - successCount);
                voucherRepository.save(voucher);
                log.info("Đã cập nhật số lượng voucher còn lại: {}", voucher.getQuantity());
            }

            Map<String, Object> result = new HashMap<>();
            result.put("success", !newlyAssigned.isEmpty());
            result.put("message", buildResultMessage(alreadyAssigned, newlyAssigned));
            result.put("details", Map.of(
                    "alreadyHasVoucher", alreadyAssigned,
                    "assigned", newlyAssigned
            ));

            return result;

        } catch (Exception e) {
            log.error("Lỗi gán voucher: {}", e.getMessage());
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
    @Override
    public VoucherResponse findById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher với id: " + id));
        return voucherMapper.toResponse(voucher);
    }
}
