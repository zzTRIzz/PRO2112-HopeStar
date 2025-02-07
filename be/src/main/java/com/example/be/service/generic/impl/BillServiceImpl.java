package com.example.be.service.generic.impl;

import com.example.be.repository.BillRepository;
import com.example.be.service.generic.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {

    @Autowired
    BillRepository billRepository;


}
