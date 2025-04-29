package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Wifi;
import com.example.be.core.admin.atribute_management.service.product.WifiService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/wifi")
public class WifiController extends FormatController<Wifi, WifiService> {

    public WifiController(WifiService wifiService) {
        super(wifiService);
    }

}
