package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Chip;
import com.example.be.core.admin.atribute_management.service.product.ChipService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/chip")
public class ChipController extends FormatController<Chip, ChipService> {

    public ChipController(ChipService chipService) {
        super(chipService);
    }

}
