package com.example.be.core.admin.atribute_management.controller.product;


import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.core.admin.atribute_management.service.product.BatteryService;
import com.example.be.entity.Battery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/battery")
public class BatteryController extends FormatController<Battery, BatteryService> {

    public BatteryController(BatteryService batteryService) {
        super(batteryService);
    }
}

