package com.example.be.service.generic.impl;

import com.example.be.entity.Wifi;
import com.example.be.repository.WifiRepository;
import com.example.be.service.generic.WifiService;
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
        newWifi.setCode(wifi.getCode());
        newWifi.setName(wifi.getName());
        newWifi.setStatus((byte) 1);
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
