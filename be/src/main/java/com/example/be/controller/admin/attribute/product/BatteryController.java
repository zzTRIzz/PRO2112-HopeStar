package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Battery;
import com.example.be.service.generic.BatteryService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/battery")
public class BatteryController extends FormatController<Battery, BatteryService> {

    public BatteryController(BatteryService batteryService) {
        super(batteryService);
    }
}

