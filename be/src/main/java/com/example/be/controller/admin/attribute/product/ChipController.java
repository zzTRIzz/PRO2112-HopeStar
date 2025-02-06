package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Chip;
import com.example.be.service.generic.ChipService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/chip")
public class ChipController extends FormatController<Chip, ChipService> {

    public ChipController(ChipService chipService) {
        super(chipService);
    }

}
