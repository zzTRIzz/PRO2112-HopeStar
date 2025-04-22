package com.example.be.core.admin.atribute_management.service.product_detail.impl;

import com.example.be.entity.Rom;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.RomRepository;
import com.example.be.core.admin.atribute_management.service.product_detail.RomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RomServiceImpl implements RomService {
    private final RomRepository romRepository;

    @Override
    public List<Rom> getAll() {
        return romRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Rom create(Rom rom) throws Exception {
        Rom newRom = new Rom();
        newRom.setCode("RMSO_"+romRepository.getNewCode());
        if (romRepository.countByCapacity(rom.getCapacity(),rom.getDescription())>0){
            throw new Exception("Rom với dung lượng này đã tồn tại");
        }
        newRom.setCapacity(rom.getCapacity());
        newRom.setDescription(rom.getDescription());
        newRom.setStatus(rom.getStatus());
        return romRepository.save(newRom);
    }

    @Override
    public void update(Integer id, Rom entity) throws Exception {
        Rom rom = getById(id);
        if (rom != null){
            if (romRepository.countByCapacityAndNotId(entity.getCapacity(), entity.getDescription(), rom.getId())<=0){
                rom.setCapacity(entity.getCapacity());
                rom.setDescription(entity.getDescription());
                rom.setStatus(entity.getStatus());
                romRepository.save(rom);
            }else {
                throw new Exception("Rom với dung lượng này đã tồn tại");
            }
        }
    }

    @Override
    public Rom getById(Integer id) throws Exception {
        return romRepository.findById(id).orElseThrow(()->
                new Exception("rom not found with id: " + id));
    }

    @Override
    public List<Rom> getAllActive() {
        return romRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
