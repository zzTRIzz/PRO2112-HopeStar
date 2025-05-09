package com.example.be.core.admin.atribute_management.controller.product_detail;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.admin.atribute_management.dto.request.ImeiRequest;
import com.example.be.core.admin.atribute_management.dto.response.ImeiResponse;
import com.example.be.core.admin.atribute_management.service.product_detail.ImeiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("")
    public ResponseData<?> updateImei(@RequestParam("id") Integer id, @RequestBody ImeiRequest imeiRequest) throws Exception {

            Object o = imeiService.updateImei(id,imeiRequest);
            return new ResponseData<>(HttpStatus.OK,"ok",o);

    }

}
