package com.example.be.core.admin.atribute_management.controller.product_detail;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.atribute_management.dto.response.ImeiResponse;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/admin/imei")
@RequiredArgsConstructor
public class ImeiController {

    private final ImeiService imeiService;

    @GetMapping("")
    public ResponseData<List<?>> getAll(){
        try {
            List<ImeiResponse> imeiResponseList = imeiService.getAllImei();
            return new ResponseData<>(HttpStatus.OK,"ok",imeiResponseList);
        }catch (Exception e){
            return new ResponseData<>(HttpStatus.NOT_FOUND,e.getMessage());
        }
    }

}
