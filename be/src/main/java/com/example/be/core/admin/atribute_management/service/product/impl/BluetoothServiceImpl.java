package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Bluetooth;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.BluetoothRepository;
import com.example.be.core.admin.atribute_management.service.product.BluetoothService;
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
    public Bluetooth create(Bluetooth bluetooth) throws Exception {
        Bluetooth newBluetooth = new Bluetooth();
        newBluetooth.setCode("BLTO_"+bluetoothRepository.getNewCode());
        if (bluetoothRepository.existsByNameTrimmedIgnoreCase(bluetooth.getName())){
            throw new Exception("bluetooth name already exists");
        }
        newBluetooth.setName(bluetooth.getName());
        newBluetooth.setStatus(bluetooth.getStatus());
        return bluetoothRepository.save(newBluetooth);
    }

    @Override
    public void update(Integer id, Bluetooth entity) throws Exception {
        Bluetooth bluetooth = getById(id);
        if (bluetooth != null){
            if (!bluetoothRepository.existsByNameTrimmedIgnoreCaseAndNotId(entity.getName(),bluetooth.getId())){
                bluetooth.setName(entity.getName());
                bluetooth.setStatus(entity.getStatus());
                bluetoothRepository.save(bluetooth);
            }else {
                throw new Exception("bluetooth name already exists");
            }
        }
    }

    @Override
    public Bluetooth getById(Integer id) throws Exception {
        return bluetoothRepository.findById(id).orElseThrow(()->
                new Exception("bluetooth not found with id: " + id));
    }

    @Override
    public List<Bluetooth> getAllActive() {
        return bluetoothRepository.findByStatus(StatusCommon.ACTIVE);
    }
}
