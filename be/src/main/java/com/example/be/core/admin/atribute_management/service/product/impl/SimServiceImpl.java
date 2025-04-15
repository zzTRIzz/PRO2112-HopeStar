package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Sim;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.SimRepository;
import com.example.be.core.admin.atribute_management.service.product.SimService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimServiceImpl implements SimService {
    private final SimRepository simRepository;


    @Override
    public List<Sim> getAll() {
        return simRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Sim create(Sim sim) throws Exception {
        Sim newSim = new Sim();
        newSim.setCode("SIMS_"+simRepository.getNewCode());
        newSim.setType(sim.getType());
        if (simRepository.existsByTypeTrimmedIgnoreCase(sim.getType())){
            throw new Exception("Loại sim đã tồn tại");
        }
        newSim.setStatus(sim.getStatus());
        return simRepository.save(newSim);
    }

    @Override
    public void update(Integer id, Sim entity) throws Exception {
        Sim sim = getById(id);
        if (sim != null){
            if (!simRepository.existsByTypeTrimmedIgnoreCaseAndNotId(entity.getType(),sim.getId())){
                sim.setType(entity.getType());
                sim.setStatus(entity.getStatus());
                simRepository.save(sim);
            }else {
                throw new Exception("Loại sim đã tồn tại");
            }
        }
    }

    @Override
    public Sim getById(Integer id) throws Exception {
        return simRepository.findById(id).orElseThrow(()->
                new Exception("sim not found with id: " + id));
    }

    @Override
    public List<Sim> getAllActive() {
        return simRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
