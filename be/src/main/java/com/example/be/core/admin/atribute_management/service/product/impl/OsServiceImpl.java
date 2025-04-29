package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Os;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.OsRepository;
import com.example.be.core.admin.atribute_management.service.product.OsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OsServiceImpl implements OsService {

    private final OsRepository osRepository;

    @Override
    public List<Os> getAll() {
        return osRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Os create(Os os) throws Exception {
        Os newOs = new Os();
        if (osRepository.existsByNameTrimmedIgnoreCase(os.getName())){
            throw new Exception("Hệ điều hành đã tồn tại");
        }
        newOs.setName(os.getName());
        newOs.setStatus(os.getStatus());
        return osRepository.save(newOs);
    }

    @Override
    public void update(Integer id, Os entity) throws Exception {
        Os os = getById(id);
        if (os != null){
            if (!osRepository.existsByNameTrimmedIgnoreCaseAndNotId(entity.getName(),os.getId())){
                os.setName(entity.getName());
                os.setStatus(entity.getStatus());
                osRepository.save(os);
            }else {
                throw new Exception("Hệ điều hành đã tồn tại");
            }
        }
    }

    @Override
    public Os getById(Integer id) throws Exception {
        return osRepository.findById(id).orElseThrow(()->
                new Exception("os not found with id: " + id));
    }

    @Override
    public List<Os> getAllActive() {
        return osRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
