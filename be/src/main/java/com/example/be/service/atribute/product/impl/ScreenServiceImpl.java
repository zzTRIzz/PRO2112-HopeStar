package com.example.be.service.atribute.product.impl;

import com.example.be.entity.Screen;
import com.example.be.entity.Screen;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.ScreenRepository;
import com.example.be.repository.ScreenRepository;
import com.example.be.service.atribute.product.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@RequiredArgsConstructor
@Service
public class ScreenServiceImpl implements ScreenService {

    private final ScreenRepository screenRepository;

    @Override
    public List<Screen> getAll() {
        return screenRepository.findAll();
    }

    @Override
    public Screen create(Screen screen) {
        Screen newScreen = new Screen();
        newScreen.setCode("SCRE_"+screenRepository.getNewCode());
        newScreen.setDisplaySize(screen.getDisplaySize());
        newScreen.setResolution(screen.getResolution());
        newScreen.setRefreshRate(screen.getRefreshRate());
        newScreen.setType(screen.getType());
        newScreen.setStatus(StatusCommon.ACTIVE);
        return screenRepository.save(newScreen);
    }

    @Override
    public void update(Integer id, Screen entity) throws Exception {
        Screen screen = getById(id);
        if (screen != null){
            screenRepository.save(entity);
        }
    }

    @Override
    public Screen getById(Integer id) throws Exception {
        return screenRepository.findById(id).orElseThrow(()->
                new Exception("screen not found with id: " + id));
    }
}
