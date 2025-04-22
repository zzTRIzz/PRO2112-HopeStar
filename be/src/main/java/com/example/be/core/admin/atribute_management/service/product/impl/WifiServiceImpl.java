package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Wifi;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.WifiRepository;
import com.example.be.core.admin.atribute_management.service.product.WifiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WifiServiceImpl implements WifiService {

    private final WifiRepository wifiRepository;

    @Override
    public List<Wifi> getAll() {
        return wifiRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Wifi create(Wifi wifi) throws Exception {
        Wifi newWifi = new Wifi();
        newWifi.setCode("WIFI_"+wifiRepository.getNewCode());
        if (wifiRepository.existsByNameTrimmedIgnoreCase(wifi.getName())){
            throw new Exception("Loại wifi đã tồn tại");
        }
        newWifi.setName(wifi.getName());
        newWifi.setStatus(wifi.getStatus());
        return wifiRepository.save(newWifi);
    }

    @Override
    public void update(Integer id, Wifi entity) throws Exception {
        Wifi wifi = getById(id);
        if (wifi != null){
            if (!wifiRepository.existsByNameTrimmedIgnoreCaseAndNotId(entity.getName(),wifi.getId())){
                wifi.setName(entity.getName());
                wifi.setStatus(entity.getStatus());
                wifiRepository.save(wifi);
            }else {
                throw new Exception("Loại wifi đã tồn tại");
            }
        }
    }

    @Override
    public Wifi getById(Integer id) throws Exception {
        return wifiRepository.findById(id).orElseThrow(()->
                new Exception("wifi not found with id: " + id));
    }

    @Override
    public List<Wifi> getAllActive() {
        return wifiRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
