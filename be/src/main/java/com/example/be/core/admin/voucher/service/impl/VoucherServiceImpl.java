package com.example.be.core.admin.voucher.service.impl;

import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Account;
import com.example.be.entity.Voucher;
import com.example.be.core.admin.voucher.mapper.VoucherMapper;
import com.example.be.entity.VoucherAccount;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.VoucherAccountRepository;
import com.example.be.repository.VoucherRepository;
import com.example.be.core.admin.voucher.service.VoucherService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherServiceImpl implements VoucherService {
    private final VoucherMapper voucherMapper;
    private final VoucherRepository voucherRepository;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private VoucherAccountRepository voucherAccountRepository;


    @Override
    public List<VoucherResponse> getAll() {
        List<Voucher> vouchers = voucherRepository.findAllOrderByIdDesc();
        return vouchers.stream()
                .map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse add(VoucherRequest request) {
        Voucher voucher = voucherMapper.toEntity(request);
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(voucher);
    }

    @Override
    public VoucherResponse update(Integer id, VoucherRequest request) {
        Voucher voucher = voucherMapper.toEntity(id, request);
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(voucher);
    }

    @Override
    public void updateSoLuongVoucher(Integer idVoucher) {
        Voucher voucher = voucherRepository.findById(idVoucher)
                .orElseThrow(() -> new RuntimeException("Khong tim thay voucher"));

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
    public void assignVoucherToCustomers(Integer voucherId, List<Integer> customerIds) {
        try {
            // Lấy thông tin voucher
            Voucher voucher = voucherRepository.findById(voucherId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher"));

            // Lấy danh sách khách hàng
            List<Account> customers = accountRepository.findAllById(customerIds);

            // Đếm số khách hàng chưa có voucher này
            int newAssignments = 0;
            for (Account customer : customers) {
                if (!voucherAccountRepository.existsByIdAccountAndIdVoucher(customer, voucher)) {
                    newAssignments++;
                }
            }

            // Kiểm tra số lượng voucher còn lại
            if (voucher.getQuantity() < newAssignments) {
                throw new RuntimeException("Số lượng voucher không đủ để phân phối");
            }

            // Thêm voucher cho từng khách hàng
            for (Account customer : customers) {
                if (!voucherAccountRepository.existsByIdAccountAndIdVoucher(customer, voucher)) {
                    VoucherAccount voucherAccount = new VoucherAccount();
                    voucherAccount.setIdAccount(customer);
                    voucherAccount.setIdVoucher(voucher);
                    voucherAccountRepository.save(voucherAccount);

                    // Gửi email thông báo
                    sendVoucherEmail(customer, voucher);

                    // Giảm số lượng voucher
                    voucher.setQuantity(voucher.getQuantity() - 1);
                }
            }

            // Lưu lại số lượng voucher đã cập nhật
            voucherRepository.save(voucher);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi phân phối voucher: " + e.getMessage());
        }
    }

    private void sendVoucherEmail(Account customer, Voucher voucher) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(customer.getEmail());
            helper.setSubject("Bạn đã nhận được một voucher mới!");

            String content = String.format("""
                            Xin chào %s,
                                        
                            Bạn vừa nhận được một voucher mới:
                                        
                            Mã voucher: %s
                            Tên voucher: %s
                            Giá trị: %s %s
                            Áp dụng cho đơn hàng từ: %s đến %s
                            Hiệu lực từ: %s đến %s
                                        
                            Cảm ơn bạn đã ủng hộ cửa hàng!
                            """,
                    customer.getFullName(),
                    voucher.getCode(),
                    voucher.getName(),
                    voucher.getDiscountValue(),
                    voucher.getVoucherType() ? "%" : "đ",
                    voucher.getConditionPriceMin(),
                    voucher.getConditionPriceMax(),
                    voucher.getStartTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    voucher.getEndTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );

            helper.setText(content);
            mailSender.send(message);
        } catch (Exception e) {
            // Log lỗi nhưng không throw exception để không ảnh hưởng đến quá trình lưu voucher
            log.error("Lỗi khi gửi email voucher: " + e.getMessage());
        }
    }

}

