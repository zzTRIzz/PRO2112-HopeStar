package com.example.be.core.admin.account.controller;

import com.example.be.core.admin.account.dto.request.AccountRequest;
import com.example.be.core.admin.account.dto.request.NhanVienRequest;
import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.account.dto.response.ResponseError;
import com.example.be.core.admin.account.service.impl.AccountService;
import com.example.be.core.client.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    private final AuthService authService;

    @GetMapping("list")
    public ResponseData<List<AccountResponse>> list(@RequestHeader(value = "Authorization") String jwt){
        try {
            authService.findAccountByJwt(jwt);
            return new ResponseData<List<AccountResponse>>(HttpStatus.OK,"Lấy user thành công",accountService.getAll());
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST,"Lỗi");
        }
    }

    @PostMapping("add")
    public ResponseData<AccountResponse> add(@RequestHeader(value = "Authorization") String jwt,@RequestBody AccountRequest request) throws Exception {
        authService.findAccountByJwt(jwt);
        return new ResponseData<>(HttpStatus.CREATED,"Thêm user thành công",accountService.create(request));
    }

    @GetMapping("get/{id}")
    public ResponseData<AccountResponse> get(@RequestHeader(value = "Authorization") String jwt,@PathVariable Integer id) throws Exception {
        authService.findAccountByJwt(jwt);
        return new ResponseData<>(HttpStatus.OK,"Lấy user thành công",accountService.getById(id));
    }

    @PutMapping("update/{id}")
    public ResponseData<AccountResponse> update(@RequestHeader(value = "Authorization") String jwt,@PathVariable Integer id, @RequestBody AccountRequest request) throws Exception {
        authService.findAccountByJwt(jwt);
        return new ResponseData<>(HttpStatus.ACCEPTED,"Cập nhật user thành công",accountService.update(id,request));
    }

    @GetMapping("list-nhan-vien")
    public ResponseData<List<AccountResponse>> listNhanVien(@RequestHeader(value = "Authorization") String jwt){
        try {
            authService.findAccountByJwt(jwt);
            return new ResponseData<List<AccountResponse>>(HttpStatus.OK,"Lấy user thành công",accountService.getAllNhanVien());
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST,"Lỗi");
        }
    }

    @PostMapping("add-nhan-vien")
    public ResponseData<AccountResponse> addNhanVien(@RequestHeader(value = "Authorization") String jwt,@RequestBody NhanVienRequest request) throws Exception {
        authService.findAccountByJwt(jwt);
        return new ResponseData<>(HttpStatus.CREATED,"Thêm user thành công",accountService.createNhanVien(request));
    }

    @PutMapping("update-nhan-vien/{id}")
    public ResponseData<AccountResponse> updateNhanVien(@RequestHeader(value = "Authorization") String jwt,@PathVariable Integer id, @RequestBody NhanVienRequest request) throws Exception {
        authService.findAccountByJwt(jwt);
        return new ResponseData<>(HttpStatus.ACCEPTED,"Cập nhật user thành công",accountService.updateNhanVien(id,request));
    }

    @GetMapping("list-khach-hang")
    public ResponseData<List<AccountResponse>> listKhachHang(@RequestHeader(value = "Authorization") String jwt) throws Exception {
        authService.findAccountByJwt(jwt);
        try {
            return new ResponseData<List<AccountResponse>>(HttpStatus.OK,"Lấy user thành công",accountService.getAllGuest());
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST,"Lỗi");
        }
    }

    @PutMapping("update-profile")
    public ResponseData<?> updateProfile(@RequestHeader(value = "Authorization") String jwt,@RequestParam String email,@RequestBody AccountRequest request){
        try {
            authService.findAccountByJwt(jwt);
            return new ResponseData<>(HttpStatus.ACCEPTED,"Cập nhật thông tin thành công", accountService.updateProfile(email,request));
        }catch (Exception e){
            return new ResponseError(HttpStatus.BAD_REQUEST,"Lỗi");
        }
    }
}
