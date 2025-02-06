package com.example.be.service.generic.impl;

import com.example.be.entity.Battery;
import com.example.be.repository.BatteryRepository;
import com.example.be.service.generic.BatteryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class BatteryServiceImpl implements BatteryService {

    private final BatteryRepository batteryRepository;

    @Override
    public List<Battery> getAll() {
        return batteryRepository.findAll();
    }

    @Override
    public Battery create(Battery battery) {
        Battery newBattery = new Battery();
        newBattery.setCode(battery.getCode());
        newBattery.setCapacity(battery.getCapacity());
        newBattery.setType(battery.getType());
        newBattery.setStatus((byte) 1);
        return batteryRepository.save(newBattery);
    }

    @Override
    public void update(Integer id, Battery entity) throws Exception {
        Battery battery = getById(id);
        if (battery != null){
            batteryRepository.save(entity);
        }
    }

    @Override
    public Battery getById(Integer id) throws Exception {
        return batteryRepository.findById(id).orElseThrow(()->
                new Exception("battery not found with id: " + id));
    }
}
