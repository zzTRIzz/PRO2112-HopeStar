package com.example.be.service.atribute.product_detail.impl;

import com.example.be.entity.Rom;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.RomRepository;
import com.example.be.service.atribute.product_detail.RomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class RomServiceImpl implements RomService {
    private final RomRepository romRepository;

    @Override
    public List<Rom> getAll() {
        return romRepository.findAll();
    }

    @Override
    public Rom create(Rom rom) {
        Rom newRom = new Rom();
        newRom.setCode("RoMS"+romRepository.getNewCode());
        newRom.setCapacity(rom.getCapacity());
        newRom.setDescription(rom.getDescription());
        newRom.setStatus(StatusCommon.ACTIVE);
        return romRepository.save(newRom);
    }

    @Override
    public void update(Integer id, Rom entity) throws Exception {
        Rom rom = getById(id);
        if (rom != null){
            romRepository.save(entity);
        }
    }

    @Override
    public Rom getById(Integer id) throws Exception {
        return romRepository.findById(id).orElseThrow(()->
                new Exception("rom not found with id: " + id));
    }
}
