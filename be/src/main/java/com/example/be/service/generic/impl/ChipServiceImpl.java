package com.example.be.service.generic.impl;

import com.example.be.entity.Chip;
import com.example.be.entity.Chip;
import com.example.be.repository.ChipRepository;
import com.example.be.service.generic.ChipService;
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
    public Chip create(Chip chip) {
        Chip newChip = new Chip();
        newChip.setCode(chip.getCode());
        newChip.setName(chip.getName());
        newChip.setStatus((byte) 1);
        return chipRepository.save(newChip);
    }

    @Override
    public void update(Integer id, Chip entity) throws Exception {
        Chip chip = getById(id);
        if (chip != null){
            chipRepository.save(entity);
        }
    }

    @Override
    public Chip getById(Integer id) throws Exception {
        return chipRepository.findById(id).orElseThrow(()->
                new Exception("chip not found with id: " + id));
    }
}
