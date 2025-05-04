package com.example.be.core.admin.account.service.impl;

import com.example.be.core.admin.account.dto.request.NhanVienRequest;
import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.RoleResponse;
import com.example.be.entity.Account;
import com.example.be.entity.Role;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.AccountRepository;
import com.example.be.core.admin.account.dto.request.AccountRequest;
import com.example.be.repository.BillRepository;
import com.example.be.repository.RoleRepository;
import com.example.be.utils.EmailService;
import com.example.be.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    private final RoleRepository roleRepository;

    private final BillRepository billRepository;

    private final EmailService guiEmail;


    private void kiemTraEmail_SDT_biTrung(String email, String sdt) {
        // Kiểm tra trùng email
//        if (accountRepository.existsByEmailAndPhone(email,sdt)) {
//            throw new IllegalArgumentException("Email và số điện thoại đã tồn tại: " + email + ", " + sdt);
//        }
        if (accountRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại: " + email);
        }
//        // Kiểm tra trùng số điện thoại
//        if (accountRepository.existsByPhone(sdt)) {
//            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + sdt);
//        }
    }

    private void kiemTraEmail_SDT_biTrung(String email, String sdt, String code) {
        // Kiểm tra trùng email
//        if (accountRepository.existsByEmailAndPhone(email,sdt)) {
//            throw new IllegalArgumentException("Email và số điện thoại đã tồn tại: " + email + ", " + sdt);
//        }
        if (accountRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại: " + email);
        }
        // Kiểm tra trùng số điện thoại
//        if (accountRepository.existsByPhone(sdt)) {
//            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + sdt);
//        }
        if (code != null) {
            if (accountRepository.existsByCode(code)) {
                throw new IllegalArgumentException("Mã tài khoản đã tồn tại: " + code);
            }
        }
    }



    public AccountResponse create(AccountRequest request) {
        String matKhauDuocTaoRa = "PASSWORD" + OtpUtil.generateOtp();
        Role role = roleRepository.findById(request.getIdRole()).orElseThrow(
                () -> new RuntimeException("Role not found")
        );
        Account account = new Account();
        account.setFullName(request.getFullName());

        String newCode = "USER_"+ accountRepository.getNewCode();
        account.setCode(newCode);
        account.setEmail(request.getEmail());
        account.setPassword(
                new BCryptPasswordEncoder().encode(matKhauDuocTaoRa)
        );
        account.setPhone(request.getPhone());
        account.setAddress(request.getAddress());
        account.setGoogleId(request.getGoogleId());
        account.setImageAvatar(request.getImageAvatar());
        account.setIdRole(role);
        account.setGender(request.getGender());
        account.setBirthDate(request.getBirthDate());
        account.setStatus(StatusCommon.ACTIVE);

        //kiemTraEmail_SDT_biTrung(request.getEmail(), request.getPhone());
        kiemTraEmail_SDT_biTrung(request.getEmail(), request.getPhone(), newCode);
        guiEmail.sendPassWordEmail(account.getEmail(), matKhauDuocTaoRa );
        return convertToResponse(accountRepository.save(account));
    }

    public AccountResponse createNhanVien(NhanVienRequest request){
//        if (request.getCode() == null || request.getCode().isEmpty()) {
//            throw new IllegalArgumentException("Mã tài khoản không được để trống");
//        }

        String matKhauDuocTaoRa = "PASSWORD" + OtpUtil.generateOtp();

        Role role = roleRepository.findById(3).orElseThrow(
                () -> new RuntimeException("Role not found")
        );
        Account account = new Account();
        account.setFullName(request.getFullName());
        account.setBirthDate(request.getBirthDate());
        account.setCode(request.getCode());
        account.setEmail(request.getEmail());
        account.setPassword(
                new BCryptPasswordEncoder().encode(matKhauDuocTaoRa)
        );
        account.setPhone(request.getPhone());
        account.setAddress(request.getAddress());
        account.setGoogleId(request.getGoogleId());
        account.setImageAvatar(request.getImageAvatar());
        account.setIdRole(role);
        account.setGender(request.getGender());
        account.setStatus(StatusCommon.ACTIVE);

        //kiemTraEmail_SDT_biTrung(request.getEmail(), request.getPhone());
        kiemTraEmail_SDT_biTrung(request.getEmail(), request.getPhone(), request.getCode());
        guiEmail.sendPassWordEmail(account.getEmail(), matKhauDuocTaoRa );
        return convertToResponse(accountRepository.save(account));
    }

    public List<AccountResponse> getAll() {
        return accountRepository.findAll().stream()
                .map(this::convertToResponse)
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList());
    }

    public List<AccountResponse> getAllGuest(){
        Role role = roleRepository.findById(4).orElseThrow(() -> new RuntimeException(">>>>Role not found khách hàng"));
        return accountRepository.findAccountsByIdRole(role)
                .stream()
                .map(this::convertToResponse)
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList());
    }

    public List<AccountResponse> getAllNhanVien() {
        Role role = roleRepository.findById(3).orElseThrow(() -> new RuntimeException(">>>>Role not found khách hàng"));
        return accountRepository.findAccountsByIdRole(role)
                .stream()
                .map(this::convertToResponse)
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId())) // Sắp xếp giảm dần
                .collect(Collectors.toList());
    }

    private AccountResponse convertToResponse(Account account) {
        RoleResponse roleResponse = roleRepository.findById(account.getIdRole().getId())
                .map(role -> {
                    RoleResponse roleResponse1 = new RoleResponse();
                    roleResponse1.setId(role.getId());
                    roleResponse1.setCode(role.getCode());
                    roleResponse1.setName(role.getName());
                    return roleResponse1;
                }).orElse(null);

        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setFullName(account.getFullName());
        response.setCode(account.getCode());
        response.setEmail(account.getEmail());
        response.setPassword(account.getPassword());
        response.setPhone(account.getPhone());
        response.setAddress(account.getAddress());
        response.setGoogleId(account.getGoogleId());
        response.setImageAvatar(account.getImageAvatar());
        response.setIdRole(roleResponse);
        response.setGender(account.getGender());
        response.setBirthDate(account.getBirthDate());
        response.setStatus(String.valueOf(account.getStatus()));

        return response;
    }


//    private void kiemTraEmail_SDT_biTrungKhiUpdate(Integer id,String email, String sdt) {
//        AccountResponse accountHienTai = getById(id);
//        if (accountHienTai == null) {
//            throw new IllegalArgumentException("Không tìm thấy tài khoản với id: " + id);
//        }
//        // Kiểm tra trùng email
//        if (!accountHienTai.getEmail().equals(email) && !accountHienTai.getPhone().equals(sdt) && accountRepository.existsByEmailAndPhone(email, sdt)) {
//            throw new IllegalArgumentException("Email và số điện thoại đã tồn tại: " + email + ", " + sdt);
//        }
//        // Kiểm tra trùng email (bỏ qua nếu email không thay đổi)
//        if (!accountHienTai.getEmail().equals(email) && accountRepository.existsByEmail(email)) {
//            throw new IllegalArgumentException("Email đã tồn tại: " + email);
//        }
//        // Kiểm tra trùng số điện thoại (bỏ qua nếu số điện thoại không thay đổi)
//        if (!accountHienTai.getPhone().equals(sdt) && accountRepository.existsByPhone(sdt)) {
//            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + sdt);
//        }
//    }

    private void kiemTraEmail_SDT_biTrungKhiUpdate(Integer id, String email, String sdt) {
        AccountResponse accountHienTai = getById(id);
        if (accountHienTai == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản với id: " + id);
        }

        // Kiểm tra trùng email và số điện thoại
//        if ((accountHienTai.getEmail() == null || !accountHienTai.getEmail().equals(email)) &&
//                (accountHienTai.getPhone() == null || !accountHienTai.getPhone().equals(sdt)) &&
//                accountRepository.existsByEmailAndPhone(email, sdt)) {
//            throw new IllegalArgumentException("Email và số điện thoại đã tồn tại: " + email + ", " + sdt);
//        }

        // Kiểm tra trùng email (bỏ qua nếu email không thay đổi)
        if ((accountHienTai.getEmail() == null || !accountHienTai.getEmail().equals(email)) &&
                accountRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại: " + email);
        }

        // Kiểm tra trùng số điện thoại (bỏ qua nếu số điện thoại không thay đổi)
//        if ((accountHienTai.getPhone() == null || !accountHienTai.getPhone().equals(sdt)) &&
//                accountRepository.existsByPhone(sdt)) {
//            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + sdt);
//        }


    }

    private void kiemTraEmail_SDT_biTrungKhiUpdate(Integer id, String email, String sdt, String code) {
        AccountResponse accountHienTai = getById(id);
        if (accountHienTai == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản với id: " + id);
        }

        // Kiểm tra trùng email và số điện thoại
//        if ((accountHienTai.getEmail() == null || !accountHienTai.getEmail().equals(email)) &&
//                (accountHienTai.getPhone() == null || !accountHienTai.getPhone().equals(sdt)) &&
//                accountRepository.existsByEmailAndPhone(email, sdt)) {
//            throw new IllegalArgumentException("Email và số điện thoại đã tồn tại: " + email + ", " + sdt);
//        }

        // Kiểm tra trùng email (bỏ qua nếu email không thay đổi)
        if ((accountHienTai.getEmail() == null || !accountHienTai.getEmail().equals(email)) &&
                accountRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email đã tồn tại: " + email);
        }

        // Kiểm tra trùng số điện thoại (bỏ qua nếu số điện thoại không thay đổi)
//        if ((accountHienTai.getPhone() == null || !accountHienTai.getPhone().equals(sdt)) &&
//                accountRepository.existsByPhone(sdt)) {
//            throw new IllegalArgumentException("Số điện thoại đã tồn tại: " + sdt);
//        }

        if ((accountHienTai.getCode() != null && !accountHienTai.getCode().equals(code)) &&
                accountRepository.existsByCode(code)) { // Sửa thành existsByCode
            throw new IllegalArgumentException("Mã tài khoản đã tồn tại: " + code);
        }
    }


    public AccountResponse update(Integer id, AccountRequest request) {
        kiemTraEmail_SDT_biTrungKhiUpdate(id,request.getEmail(), request.getPhone());

        Role role = roleRepository.findById(request.getIdRole()).orElseThrow(
                () -> new RuntimeException("Role not found")
        );
        Account account = accountRepository.findById(id).orElseThrow();
        account.setFullName(request.getFullName());
        account.setEmail(request.getEmail());
        // Chỉ cập nhật mật khẩu nếu request.getPassword() có giá trị hợp lệ
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            account.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
        }
        account.setPhone(request.getPhone());
        account.setAddress(request.getAddress());
        account.setGoogleId(request.getGoogleId());
        account.setImageAvatar(request.getImageAvatar());
        account.setIdRole(role);
        account.setGender(request.getGender());
        account.setBirthDate(request.getBirthDate());
        account.setStatus(StatusCommon.valueOf(request.getStatus()));


        //kiemTraEmail_SDT_biTrungKhiUpdate(id,request.getEmail(), request.getPhone(), request.getCode());
        return convertToResponse(accountRepository.save(account));
    }

    public AccountResponse updateNhanVien(Integer id, NhanVienRequest request){
        kiemTraEmail_SDT_biTrungKhiUpdate(id,request.getEmail(), request.getPhone());
        Role role = roleRepository.findById(3).orElseThrow(
                () -> new RuntimeException("Role not found")
        );
        Account account = accountRepository.findById(id).orElseThrow();
        account.setCode(request.getCode());
        account.setFullName(request.getFullName());
        account.setEmail(request.getEmail());
        // Chỉ cập nhật mật khẩu nếu request.getPassword() có giá trị hợp lệ
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            account.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
        }
        account.setPhone(request.getPhone());
        account.setAddress(request.getAddress());
        account.setGoogleId(request.getGoogleId());
        account.setImageAvatar(request.getImageAvatar());
        account.setIdRole(role);
        account.setGender(request.getGender());
        account.setBirthDate(request.getBirthDate());
        account.setStatus(StatusCommon.valueOf(request.getStatus()));


        //kiemTraEmail_SDT_biTrungKhiUpdate(id,request.getEmail(), request.getPhone(), request.getCode());
        return convertToResponse(accountRepository.save(account));
    }

    public AccountResponse getById(Integer id) {
        return accountRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với id: " + id));
    }


    public List<AccountResponse> getAllKhachHang() {
        return accountRepository.getAllAccountKhachHang(StatusCommon.ACTIVE).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    public AccountResponse getByAccount(Integer idBill) {
        try {
            billRepository.findById(idBill).orElseThrow(() -> new RuntimeException("Không tìm thấy bill" + idBill));
            Account accounts = accountRepository.getByAccount(idBill);
            if (accounts == null) {
                return new AccountResponse(); // Trả về đối tượng rỗng thay vì null
            }
            return convertToResponse(accounts);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tìm khách hàng cho hóa đơn: " + e.getMessage());
        }
    }

    public AccountResponse updateProfile(String email, AccountRequest request) {
        Account account = accountRepository.findByEmail(email);
        if (account == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản với email: " + email);
        }
        account.setFullName(request.getFullName());
        account.setPhone(request.getPhone());
        account.setGender(request.getGender());
        account.setBirthDate(request.getBirthDate());
        return convertToResponse(accountRepository.save(account));
    }
}
