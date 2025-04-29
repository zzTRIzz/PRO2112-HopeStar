package com.example.be.core.admin.atribute_management.service.product.impl;

import com.example.be.entity.Card;
import com.example.be.entity.status.StatusCommon;
import com.example.be.repository.CardRepository;
import com.example.be.core.admin.atribute_management.service.product.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    @Override
    public List<Card> getAll() {
        return cardRepository.findAll().stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public Card create(Card card) throws Exception {
        Card newCard = new Card();
        newCard.setCode("CARD_"+cardRepository.getNewCode());
        if (cardRepository.existsByTypeTrimmedIgnoreCase(card.getType())){
            throw new Exception("Tên thẻ nhớ đã tồn tại");
        }
        newCard.setType(card.getType());
        newCard.setStatus(card.getStatus());
        return cardRepository.save(newCard);
    }

    @Override
    public void update(Integer id, Card entity) throws Exception {
        Card card = getById(id);
        if (card != null){
            if (!cardRepository.existsByTypeTrimmedIgnoreCaseAndNotId(entity.getType(),card.getId())){
                card.setType(entity.getType());
                card.setStatus(entity.getStatus());
                cardRepository.save(card);
            }else {
                throw new Exception("Tên thẻ nhớ đã tồn tại");
            }
        }
    }

    @Override
    public Card getById(Integer id) throws Exception {
        return cardRepository.findById(id).orElseThrow(()->
                new Exception("card not found with id: " + id));
    }

    @Override
    public List<Card> getAllActive() {
        return cardRepository.findByStatus(StatusCommon.ACTIVE).stream()
                .sorted((s1, s2) -> Long.compare(s2.getId(), s1.getId()))
                .collect(Collectors.toList());
    }
}