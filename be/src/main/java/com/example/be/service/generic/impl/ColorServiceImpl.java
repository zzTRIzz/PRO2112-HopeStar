package com.example.be.service.generic.impl;

import com.example.be.entity.Color;
import com.example.be.service.generic.ColorService;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ColorServiceImpl implements ColorService {
    @Override
    public List<Color> getAll() {
        return null;
    }

    @Override
    public Color create(Color entity) {
        return null;
    }

    @Override
    public void update(Integer integer, Color entity) {
    }

    @Override
    public Color getById(Integer integer) {
        return null;
    }
}
