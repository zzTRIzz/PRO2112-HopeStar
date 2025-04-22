package com.example.be.core.admin.atribute_management.service.product_detail.impl;

import com.example.be.entity.Ram;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.RamRepository;
import com.example.be.core.admin.atribute_management.service.product_detail.RamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RamServiceImpl implements RamService {
    private final RamRepository ramRepository;

    @Override
    public List<Ram> getAll() {
        return ramRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Ram create(Ram ram) throws Exception {
        Ram newRam = new Ram();
        newRam.setCode("RAMS_"+ramRepository.getNewCode());
        if (ramRepository.countByCapacity(ram.getCapacity(),ram.getDescription())>0){
            throw new Exception("Ram với dung lượng này đã tồn tại");
        }
        newRam.setCapacity(ram.getCapacity());
        newRam.setDescription(ram.getDescription());
        newRam.setStatus(ram.getStatus());
        return ramRepository.save(newRam);
    }

    @Override
    public void update(Integer id, Ram entity) throws Exception {
        Ram ram = getById(id);
        if (ram != null){
            if (ramRepository.countByCapacityAndNotId(entity.getCapacity(), entity.getDescription(), ram.getId())<=0){
                ram.setCapacity(entity.getCapacity());
                ram.setDescription(entity.getDescription());
                ram.setStatus(entity.getStatus());
                ramRepository.save(ram);
            }else {
                throw new Exception("Ram với dung lượng này đã tồn tại");
            }
        }
    }

    @Override
    public Ram getById(Integer id) throws Exception {
        return ramRepository.findById(id).orElseThrow(()->
                new Exception("ram not found with id: " + id));
    }

    @Override
    public List<Ram> getAllActive() {
        return ramRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
