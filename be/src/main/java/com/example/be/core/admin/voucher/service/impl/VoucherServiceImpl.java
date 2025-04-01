package com.example.be.core.admin.voucher.service.impl;

import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.RoleResponse;
import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.entity.VoucherAccount;
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

import java.time.LocalDate;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
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
        Voucher voucher = voucherMapper.toEntity(id, request);
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(voucher);
    }

    @Override
    public void updateSoLuongVoucher(Integer idVoucher) {
        Voucher voucher = voucherRepository.findById(idVoucher)
                .orElseThrow(()->new RuntimeException("Khong tim thay voucher"));

        Integer soLuongConLai = voucher.getQuantity() - 1;
        voucher.setQuantity(soLuongConLai);
        voucherRepository.save(voucher);
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

            if (voucher.getQuantity() < customerIds.size()) {
                throw new RuntimeException("Số lượng voucher không đủ để phân phối");
            }

            List<Account> customers = accountRepository.findAllById(customerIds);
            List<String> alreadyAssigned = new ArrayList<>();
            List<String> newlyAssigned = new ArrayList<>();
            int successCount = 0;

            for (Account customer : customers) {
                try {
                    // Kiểm tra đã được gán chưa
                    if (voucherAccountRepository.existsByIdVoucherIdAndIdAccountId(voucherId, customer.getId())) {
                        log.info("Bỏ qua - {} đã có voucher này", customer.getEmail());
                        alreadyAssigned.add(customer.getEmail());
                        continue;
                    }

                    // Gán voucher mới
                    VoucherAccount voucherAccount = new VoucherAccount();
                    voucherAccount.setIdVoucher(voucher);
                    voucherAccount.setIdAccount(customer);
                    voucherAccountRepository.save(voucherAccount);

                    successCount++;
                    newlyAssigned.add(customer.getEmail());
                    log.info("Đã gán voucher cho {}", customer.getEmail());

                    // Gửi email
                    try {
                        sendVoucherEmail(customer, voucher);
                        log.info("✓ Đã gửi email thành công đến {}", customer.getEmail());
                    } catch (Exception e) {
                        log.error("❌ Lỗi gửi email đến {}: {}", customer.getEmail(), e.getMessage());
                    }

                } catch (Exception e) {
                    log.error("Lỗi xử lý cho {}: {}", customer.getEmail(), e.getMessage());
                }
            }

            // Cập nhật số lượng voucher
            if (successCount > 0) {
                voucher.setQuantity(voucher.getQuantity() - successCount);
                voucherRepository.save(voucher);
            }

            // Tạo response
            Map<String, Object> result = new HashMap<>();
            result.put("success", alreadyAssigned.isEmpty());
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Xin chào %s!</h2>
                <p>Bạn vừa được thêm một voucher mới vào tài khoản.</p>
                <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                    <p><strong>Chi tiết voucher:</strong></p>
                    <ul style="list-style: none; padding-left: 0;">
                        <li style="margin-bottom: 8px;"><strong>Mã voucher:</strong> %s</li>
                        <li style="margin-bottom: 8px;"><strong>Tên voucher:</strong> %s</li>
                        <li style="margin-bottom: 8px;"><strong>Giá trị:</strong> %s</li>
                        <li style="margin-bottom: 8px;"><strong>Điều kiện:</strong> Đơn hàng từ %s đ</li>
                        <li style="margin-bottom: 8px;"><strong>Thời hạn:</strong> %s - %s</li>
                    </ul>
                </div>
                <p>Hãy sử dụng voucher này cho đơn hàng tiếp theo của bạn!</p>
                <p style="margin-top: 20px;">Trân trọng,<br>HopeStar</p>
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

    @Override
    public List<AccountResponse> getAccountsWithVoucher(Integer voucherId) {
        List<VoucherAccount> voucherAccounts = voucherAccountRepository
                .findByIdVoucherId(voucherId);

        return voucherAccounts.stream()
                .map(voucherAccount -> {
                    Account account = voucherAccount.getIdAccount();
                    return AccountResponse.builder()
                            .id(account.getId())
                            .fullName(account.getFullName())
                            .email(account.getEmail())
                            .phone(account.getPhone())
                            .status(account.getStatus().toString())
                            .idRole(RoleResponse.builder()
                                    .id(account.getIdRole().getId())
                                    .name(account.getIdRole().getName())
                                    .build())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
