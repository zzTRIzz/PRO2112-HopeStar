package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.core.admin.atribute_management.service.product.BatteryService;
import com.example.be.entity.Battery;
import com.example.be.repository.BatteryRepository;

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
    public Battery create(Battery battery) throws Exception {
        Battery newBattery = new Battery();
        newBattery.setCode("BATE_"+batteryRepository.getNewCode());
        if (batteryRepository.existsByTypeAndCapacity(battery.getType(), battery.getCapacity())){
            throw new Exception("battery type with capacity already exists");
        }
        newBattery.setCapacity(battery.getCapacity());
        newBattery.setType(battery.getType());
        newBattery.setStatus(battery.getStatus());
        return batteryRepository.save(newBattery);
    }

    @Override
    public void update(Integer id, Battery entity) throws Exception {
        Battery battery = getById(id);
        if (battery != null){
            if (!batteryRepository.existsByTypeAndCapacityAndNotId(entity.getType(),entity.getCapacity(),battery.getId())){
                battery.setType(entity.getType());
                battery.setStatus(entity.getStatus());
                batteryRepository.save(battery);
            }else {
                throw new Exception("battery type with capacity already exists");
            }
        }
    }

    @Override
    public Battery getById(Integer id) throws Exception {
        return batteryRepository.findById(id).orElseThrow(()->
                new Exception("battery not found with id: " + id));
    }
}
