package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Bluetooth;
import com.example.be.service.generic.BluetoothService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/bluetooth")
public class BluetoothController extends FormatController<Bluetooth, BluetoothService> {

    public BluetoothController(BluetoothService bluetoothService) {
        super(bluetoothService);
    }

}
