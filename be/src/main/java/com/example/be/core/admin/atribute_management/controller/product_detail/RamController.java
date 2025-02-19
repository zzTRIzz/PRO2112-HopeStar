package com.example.be.core.admin.atribute_management.controller.product_detail;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Ram;
import com.example.be.core.admin.atribute_management.service.product_detail.RamService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/ram")
public class RamController extends FormatController<Ram, RamService> {

    public RamController(RamService ramService) {
        super(ramService);
    }

}
