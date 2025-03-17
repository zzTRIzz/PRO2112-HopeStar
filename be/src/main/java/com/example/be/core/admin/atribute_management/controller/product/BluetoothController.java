package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Bluetooth;
import com.example.be.core.admin.atribute_management.service.product.BluetoothService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/bluetooth")
public class BluetoothController extends FormatController<Bluetooth, BluetoothService> {

    public BluetoothController(BluetoothService bluetoothService) {
        super(bluetoothService);
    }

}
