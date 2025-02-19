package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Sim;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.SimRepository;
import com.example.be.core.admin.atribute_management.service.product.SimService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class SimServiceImpl implements SimService {
    private final SimRepository simRepository;


    @Override
    public List<Sim> getAll() {
        return simRepository.findAll();
    }

    @Override
    public Sim create(Sim sim) {
        Sim newSim = new Sim();
        newSim.setCode("SIMS_"+simRepository.getNewCode());
        newSim.setType(sim.getType());
        newSim.setStatus(StatusCommon.ACTIVE);
        return simRepository.save(newSim);
    }

    @Override
    public void update(Integer id, Sim entity) throws Exception {
        Sim sim = getById(id);
        if (sim != null){
            simRepository.save(entity);
        }
    }

    @Override
    public Sim getById(Integer id) throws Exception {
        return simRepository.findById(id).orElseThrow(()->
                new Exception("sim not found with id: " + id));
    }
}
