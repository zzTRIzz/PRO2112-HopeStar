package com.example.be.core.admin.atribute_management.controller.product;

import com.example.be.core.admin.atribute_management.controller.FormatController;
import com.example.be.entity.Card;
import com.example.be.core.admin.atribute_management.service.product.CardService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/admin/card")
public class CardController extends FormatController<Card, CardService> {

    public CardController(CardService cardService) {
        super(cardService);
    }

}
