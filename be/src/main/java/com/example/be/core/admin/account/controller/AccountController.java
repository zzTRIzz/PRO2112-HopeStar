package com.example.be.core.admin.account.controller;

import com.example.be.core.admin.account.dto.request.AccountRequest;
import com.example.be.core.admin.account.dto.response.AccountResponse;
import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.account.dto.response.ResponseError;
import com.example.be.core.admin.account.service.impl.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/account")
@RequiredArgsConstructor
public class AccountController {

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

}
