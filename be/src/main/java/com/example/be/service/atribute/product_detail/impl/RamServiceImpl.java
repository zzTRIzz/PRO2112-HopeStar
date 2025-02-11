package com.example.be.service.atribute.product_detail.impl;

import com.example.be.entity.Ram;
import com.example.be.repository.RamRepository;
import com.example.be.service.atribute.product_detail.RamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class RamServiceImpl implements RamService {
    private final RamRepository ramRepository;

    @Override
    public List<Ram> getAll() {
        return ramRepository.findAll();
    }

    @Override
    public Ram create(Ram ram) {
        Ram newRam = new Ram();
        newRam.setCode("RAMS_"+ramRepository.getNewCode());
        newRam.setCapacity(ram.getCapacity());
        newRam.setDescription(ram.getDescription());
        newRam.setStatus((byte) 1);
        return ramRepository.save(newRam);
    }

    @Override
    public void update(Integer id, Ram entity) throws Exception {
        Ram ram = getById(id);
        if (ram != null){
            ramRepository.save(entity);
        }
    }

    @Override
    public Ram getById(Integer id) throws Exception {
        return ramRepository.findById(id).orElseThrow(()->
                new Exception("ram not found with id: " + id));
    }
}
