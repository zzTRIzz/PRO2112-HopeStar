package com.example.be.service.generic.impl;

import com.example.be.entity.Bluetooth;
import com.example.be.repository.BluetoothRepository;
import com.example.be.service.generic.BluetoothService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class BluetoothServiceImpl implements BluetoothService {

    private final BluetoothRepository bluetoothRepository;

    @Override
    public List<Bluetooth> getAll() {
        return bluetoothRepository.findAll();
    }

    @Override
    public Bluetooth create(Bluetooth bluetooth) {
        Bluetooth newBluetooth = new Bluetooth();
        newBluetooth.setCode(bluetooth.getCode());
        newBluetooth.setName(bluetooth.getName());
        newBluetooth.setStatus((byte) 1);
        return bluetoothRepository.save(newBluetooth);
    }

    @Override
    public void update(Integer id, Bluetooth entity) throws Exception {
        Bluetooth bluetooth = getById(id);
        if (bluetooth != null){
            bluetoothRepository.save(entity);
        }
    }

    @Override
    public Bluetooth getById(Integer id) throws Exception {
        return bluetoothRepository.findById(id).orElseThrow(()->
                new Exception("bluetooth not found with id: " + id));
    }
}
