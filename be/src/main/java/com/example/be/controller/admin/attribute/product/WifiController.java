package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Wifi;
import com.example.be.service.generic.WifiService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/wifi")
public class WifiController extends FormatController<Wifi, WifiService> {

    public WifiController(WifiService wifiService) {
        super(wifiService);
    }

}
