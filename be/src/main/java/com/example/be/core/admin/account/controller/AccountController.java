package com.example.be.core.admin.account.controller;

import com.example.be.config.JwtProvider;
import com.example.be.core.admin.account.dto.request.AccountRequest;
import com.example.be.core.admin.account.dto.request.NhanVienRequest;
import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.account.dto.response.ResponseError;
import com.example.be.core.admin.account.service.impl.AccountService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/account")
@RequiredArgsConstructor
public class AccountController {

    private final JwtProvider jwtProvider;

    private final AccountService accountService;

    @GetMapping("list")
    public ResponseData<List<AccountResponse>> list(){
        try {
            return new ResponseData<List<AccountResponse>>(HttpStatus.OK,"Lấy user thành công",accountService.getAll());
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST,"Lỗi");
        }
    }

    @PostMapping("add")
    public ResponseData<AccountResponse> add(@RequestBody AccountRequest request){
        return new ResponseData<>(HttpStatus.CREATED,"Thêm user thành công",accountService.create(request));
    }

    @GetMapping("get/{id}")
    public ResponseData<AccountResponse> get(@PathVariable Integer id){
        return new ResponseData<>(HttpStatus.OK,"Lấy user thành công",accountService.getById(id));
    }

    @PutMapping("update/{id}")
    public ResponseData<AccountResponse> update(@PathVariable Integer id, @RequestBody AccountRequest request){
        return new ResponseData<>(HttpStatus.ACCEPTED,"Cập nhật user thành công",accountService.update(id,request));
    }

    @GetMapping("list-nhan-vien")
    public ResponseData<List<AccountResponse>> listNhanVien(){
        try {
            return new ResponseData<List<AccountResponse>>(HttpStatus.OK,"Lấy user thành công",accountService.getAllNhanVien());
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST,"Lỗi");
        }
    }

    @PostMapping("add-nhan-vien")
    public ResponseData<AccountResponse> addNhanVien(@RequestBody NhanVienRequest request){
        return new ResponseData<>(HttpStatus.CREATED,"Thêm user thành công",accountService.createNhanVien(request));
    }

    @PutMapping("update-nhan-vien/{id}")
    public ResponseData<AccountResponse> updateNhanVien(@PathVariable Integer id, @RequestBody NhanVienRequest request){
        return new ResponseData<>(HttpStatus.ACCEPTED,"Cập nhật user thành công",accountService.updateNhanVien(id,request));
    }

    @GetMapping("list-khach-hang")
    public ResponseData<List<AccountResponse>> listKhachHang(){
        try {
            return new ResponseData<List<AccountResponse>>(HttpStatus.OK,"Lấy user thành công",accountService.getAllGuest());
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST,"Lỗi");
        }
    }

    @GetMapping("/check-trang-thai-theo-mail/{jwt}")
    public ResponseData<Boolean> checkTrangThai(@PathVariable String jwt) {
        try {
            String email = jwtProvider.getEmailFromJwtToken(jwt);
            if (email == null) {
                System.out.println("Invalid JWT token: Unable to extract email");
                return new ResponseError(HttpStatus.BAD_REQUEST, "JWT không hợp lệ");
            }
            Boolean isActive = accountService.isAccountActiveByEmail(email);
            return new ResponseData<>(HttpStatus.OK, "Kiểm tra trạng thái tài khoản thành công", isActive);
        } catch (JwtException e) {
            System.out.println("JWT processing error: " + e.getMessage());
            return new ResponseError(HttpStatus.UNAUTHORIZED, "Lỗi xác thực JWT: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while checking account status: " + e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi hệ thống khi kiểm tra trạng thái");
        }
    }

}
