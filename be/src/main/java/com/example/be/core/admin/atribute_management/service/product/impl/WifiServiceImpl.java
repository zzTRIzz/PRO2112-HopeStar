package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Wifi;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.WifiRepository;
import com.example.be.core.admin.atribute_management.service.product.WifiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class WifiServiceImpl implements WifiService {

    private final WifiRepository wifiRepository;

    @Override
    public List<Wifi> getAll() {
        return wifiRepository.findAll();
    }

    @Override
    public Wifi create(Wifi wifi) {
        Wifi newWifi = new Wifi();
        newWifi.setCode("WIFI_"+wifiRepository.getNewCode());
        newWifi.setName(wifi.getName());
        newWifi.setStatus(StatusCommon.ACTIVE);
        return wifiRepository.save(newWifi);
    }

    @Override
    public void update(Integer id, Wifi entity) throws Exception {
        Wifi wifi = getById(id);
        if (wifi != null){
            wifiRepository.save(entity);
        }
    }

    @Override
    public Wifi getById(Integer id) throws Exception {
        return wifiRepository.findById(id).orElseThrow(()->
                new Exception("wifi not found with id: " + id));
    }
}
