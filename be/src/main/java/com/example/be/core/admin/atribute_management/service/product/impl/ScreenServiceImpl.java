package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.core.admin.atribute_management.service.product.ScreenService;
import com.example.be.entity.Screen;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.ScreenRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ScreenServiceImpl implements ScreenService {

    private final ScreenRepository screenRepository;

    @Override
    public List<Screen> getAll() {
        return screenRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Screen create(Screen screen) {
        Screen newScreen = new Screen();
        newScreen.setCode("SCRE_"+screenRepository.getNewCode());
        newScreen.setDisplaySize(screen.getDisplaySize());
        newScreen.setResolution(screen.getResolution());
        newScreen.setRefreshRate(screen.getRefreshRate());
        newScreen.setType(screen.getType());
        newScreen.setStatus(screen.getStatus());
        return screenRepository.save(newScreen);
    }

    @Override
    public void update(Integer id, Screen entity) throws Exception {
        Screen screen = getById(id);
        if (screen != null){
            screen.setType(entity.getType());
            screen.setResolution(entity.getResolution());
            screen.setDisplaySize(entity.getDisplaySize());
            screen.setRefreshRate(entity.getRefreshRate());
            screenRepository.save(screen);
        }
    }

    @Override
    public Screen getById(Integer id) throws Exception {
        return screenRepository.findById(id).orElseThrow(()->
                new Exception("screen not found with id: " + id));
    }

    @Override
    public List<Screen> getAllActive() {
        return screenRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}
