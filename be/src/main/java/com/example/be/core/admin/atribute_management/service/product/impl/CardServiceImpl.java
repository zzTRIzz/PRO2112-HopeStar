package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Card;
import com.example.be.repository.CardRepository;
import com.example.be.core.admin.atribute_management.service.product.CardService;
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
    public Card create(Card card) throws Exception {
        Card newCard = new Card();
        newCard.setCode("CARD_"+cardRepository.getNewCode());
        if (cardRepository.existsByTypeAndCapacity(card.getType(),card.getCapacity())){
            throw new Exception("card type with capacity already exists");
        }
        newCard.setCapacity(card.getCapacity());
        newCard.setType(card.getType());
        newCard.setStatus(card.getStatus());
        return cardRepository.save(newCard);
    }

    @Override
    public void update(Integer id, Card entity) throws Exception {
        Card card = getById(id);
        if (card != null){
            if (!cardRepository.existsByTypeAndCapacityAndNotId(entity.getType(),entity.getCapacity(),card.getId())){
                card.setType(entity.getType());
                card.setStatus(entity.getStatus());
                cardRepository.save(card);
            }else {
                throw new Exception("card type with capacity already exists");
            }
        }
    }

    @Override
    public Card getById(Integer id) throws Exception {
        return cardRepository.findById(id).orElseThrow(()->
                new Exception("card not found with id: " + id));
    }
}