package com.example.be.core.admin.atribute_management.service.product_detail.impl;

import com.example.be.entity.Color;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.ColorRepository;
import com.example.be.core.admin.atribute_management.service.product_detail.ColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColorServiceImpl implements ColorService {
    private final ColorRepository colorRepository;
    @Override
    public List<Color> getAll() {
        return colorRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Color create(Color color) throws Exception {
        Color newColor = new Color();
        newColor.setCode("COLR_"+colorRepository.getNewCode());
        if (colorRepository.existsByNameTrimmedIgnoreCase(color.getName())){
            throw new Exception("Tên màu sắc đã tồn tại");
        }
        newColor.setName(color.getName());
        newColor.setDescription(color.getDescription());
        newColor.setHex(color.getHex());
        newColor.setStatus(color.getStatus());
        return colorRepository.save(newColor);
    }

    @Override
    public void update(Integer id, Color entity) throws Exception {
        Color color = getById(id);
        if (color != null){
            if (!colorRepository.existsByNameTrimmedIgnoreCaseAndNotId(entity.getName(),color.getId())){
                color.setName(entity.getName());
                color.setStatus(entity.getStatus());
                color.setDescription(entity.getDescription());
                color.setHex(entity.getHex());
                colorRepository.save(color);
            }else {
                throw new Exception("Tên màu sắc đã tồn tại");
            }
        }
    }

    @Override
    public Color getById(Integer id) throws Exception {
        return colorRepository.findById(id).orElseThrow(()->
                new Exception("color not found with id: " + id));
    }

    @Override
    public List<Color> getAllActive() {
        return colorRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
