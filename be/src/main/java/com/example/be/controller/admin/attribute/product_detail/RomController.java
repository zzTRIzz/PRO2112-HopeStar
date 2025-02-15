package com.example.be.controller.admin.attribute.product_detail;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Rom;
import com.example.be.service.atribute.product_detail.RomService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/rom")
public class RomController extends FormatController<Rom, RomService> {

    public RomController(RomService romService) {
        super(romService);
    }

}
