package com.example.be.service.generic.impl;

import com.example.be.entity.Ram;
import com.example.be.service.generic.RamService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RamServiceImpl implements RamService {
    @Override
    public List<Ram> getAll() {
        return null;
    }

    @Override
    public Ram create(Ram entity) {
        return null;
    }

    @Override
    public void update(Integer integer, Ram entity) {
    }

    @Override
    public Ram getById(Integer integer) {
        return null;
    }
}
