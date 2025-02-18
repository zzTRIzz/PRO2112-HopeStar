package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Os;
import com.example.be.repository.OsRepository;
import com.example.be.core.admin.atribute_management.service.product.OsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class OsServiceImpl implements OsService {

    private final OsRepository osRepository;

    @Override
    public List<Os> getAll() {
        return osRepository.findAll();
    }

    @Override
    public Os create(Os os) {
        Os newOs = new Os();
        newOs.setName(os.getName());
        return osRepository.save(newOs);
    }

    @Override
    public void update(Integer id, Os entity) throws Exception {
        Os os = getById(id);
        if (os != null){
            osRepository.save(entity);
        }
    }

    @Override
    public Os getById(Integer id) throws Exception {
        return osRepository.findById(id).orElseThrow(()->
                new Exception("os not found with id: " + id));
    }
}
