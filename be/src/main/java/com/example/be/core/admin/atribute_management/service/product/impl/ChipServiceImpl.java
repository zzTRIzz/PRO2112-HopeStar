package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Chip;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.ChipRepository;
import com.example.be.core.admin.atribute_management.service.product.ChipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ChipServiceImpl implements ChipService {
    private final ChipRepository chipRepository;


    @Override
    public List<Chip> getAll() {
        return chipRepository.findAll();
    }

    @Override
    public Chip create(Chip chip) throws Exception {
        Chip newChip = new Chip();
        newChip.setCode("CHIP_"+chipRepository.getNewCode());
        if (chipRepository.existsByNameTrimmedIgnoreCase(chip.getName())){
            throw new Exception("chip name already exists");
        }
        newChip.setName(chip.getName());
        newChip.setStatus(chip.getStatus());
        return chipRepository.save(newChip);
    }

    @Override
    public void update(Integer id, Chip entity) throws Exception {
        Chip chip = getById(id);
        if (chip != null){
            if (!chipRepository.existsByNameTrimmedIgnoreCaseAndNotId(entity.getName(),chip.getId())){
                chip.setName(entity.getName());
                chip.setStatus(entity.getStatus());
                chipRepository.save(chip);
            }else {
                throw new Exception("chip name already exists");
            }
        }
    }

    @Override
    public Chip getById(Integer id) throws Exception {
        return chipRepository.findById(id).orElseThrow(()->
                new Exception("chip not found with id: " + id));
    }

    @Override
    public List<Chip> getAllActive() {
        return chipRepository.findByStatus(StatusCommon.ACTIVE);
    }
}
