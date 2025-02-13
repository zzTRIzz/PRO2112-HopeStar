package com.example.be.controller.admin.attribute.product;

import com.example.be.controller.admin.attribute.FormatController;
import com.example.be.entity.Card;
import com.example.be.service.atribute.product.CardService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/card")
public class CardController extends FormatController<Card, CardService> {

    public CardController(CardService cardService) {
        super(cardService);
    }

}
