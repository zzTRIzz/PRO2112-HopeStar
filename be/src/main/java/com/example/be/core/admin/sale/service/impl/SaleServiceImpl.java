package com.example.be.core.admin.sale.service.impl;

import com.example.be.core.admin.sale.dto.request.SaleRequest;
import com.example.be.core.admin.sale.dto.response.SaleResponse;
import com.example.be.core.admin.sale.mapper.SaleMapper;
import com.example.be.entity.Sale;
import com.example.be.repository.SaleRepository;
import com.example.be.core.admin.sale.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {
    private final SaleMapper saleMapper;
    private final SaleRepository saleRepository;

    @Override
    public List<SaleResponse> getAll() {
        List<Sale> sales = saleRepository.findAll();
        return sales.stream().map(saleMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public SaleResponse add(SaleRequest request) {
        Sale sale = saleMapper.toEntity(request);
        sale = saleRepository.save(sale);
        return saleMapper.toResponse(sale);
    }

    @Override
    public SaleResponse update(Integer id, SaleRequest request) {
        Sale sale = saleRepository.findById(id).orElseThrow(() -> new RuntimeException("Sale not found"));
        sale = saleMapper.toEntity(request);  // Update fields with new data
        sale.setId(id); // Retain the original ID
        sale = saleRepository.save(sale);
        return saleMapper.toResponse(sale);
    }

    @Override
    public void delete(Integer id) {
        Sale sale = saleRepository.findById(id).orElseThrow(() -> new RuntimeException("Sale not found"));
        saleRepository.delete(sale);
    }
}
