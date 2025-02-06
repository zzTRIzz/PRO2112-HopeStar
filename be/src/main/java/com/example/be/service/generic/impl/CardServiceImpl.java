package com.example.be.service.generic.impl;

import com.example.be.entity.Card;
import com.example.be.repository.CardRepository;
import com.example.be.service.generic.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    @Override
    public List<Card> getAll() {
        return cardRepository.findAll();
    }

    @Override
    public Card create(Card card) {
        Card newCard = new Card();
        newCard.setCode(card.getCode());
        newCard.setCapacity(card.getCapacity());
        newCard.setType(card.getType());
        newCard.setStatus((byte) 1);
        return cardRepository.save(newCard);
    }

    @Override
    public void update(Integer id, Card entity) throws Exception {
        Card card = getById(id);
        if (card != null){
            cardRepository.save(entity);
        }
    }

    @Override
    public Card getById(Integer id) throws Exception {
        return cardRepository.findById(id).orElseThrow(()->
                new Exception("card not found with id: " + id));
    }
}