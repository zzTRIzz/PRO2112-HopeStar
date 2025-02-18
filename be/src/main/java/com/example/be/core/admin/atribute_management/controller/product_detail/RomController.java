package com.example.be.core.admin.atribute_management.controller.product_detail;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Rom;
import com.example.be.core.admin.atribute_management.service.product_detail.RomService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/rom")
public class RomController extends FormatController<Rom, RomService> {

    public RomController(RomService romService) {
        super(romService);
    }

}
