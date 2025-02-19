package com.example.be.core.admin.atribute_management.service.product_detail.impl;

import com.example.be.entity.Color;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.ColorRepository;
import com.example.be.core.admin.atribute_management.service.product_detail.ColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ColorServiceImpl implements ColorService {
    private final ColorRepository colorRepository;
    @Override
    public List<Color> getAll() {
        return colorRepository.findAll();
    }

    @Override
    public Color create(Color color) {
        Color newColor = new Color();
        newColor.setCode("COLR_"+colorRepository.getNewCode());
        newColor.setName(color.getName());
        newColor.setDescription(color.getDescription());
        newColor.setHex(color.getHex());
        newColor.setStatus(StatusCommon.ACTIVE);
        return colorRepository.save(newColor);
    }

    @Override
    public void update(Integer id, Color entity) throws Exception {
        Color color = getById(id);
        if (color != null){
            colorRepository.save(entity);
        }
    }

    @Override
    public Color getById(Integer id) throws Exception {
        return colorRepository.findById(id).orElseThrow(()->
                new Exception("color not found with id: " + id));
    }
}
