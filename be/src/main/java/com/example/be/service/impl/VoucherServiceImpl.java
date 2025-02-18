package com.example.be.service.impl;

import com.example.be.dto.request.products.VoucherRequest;
import com.example.be.dto.response.products.VoucherResponse;
import com.example.be.entity.Voucher;
import com.example.be.mapper.VoucherMapper;
import com.example.be.repository.VoucherRepository;
import com.example.be.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherMapper voucherMapper;
    private final VoucherRepository voucherRepository;


    @Override
    public List<VoucherResponse> getAll() {
        List<Voucher> vouchers = voucherRepository.findAll();
        return vouchers.stream().map(voucherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse add(VoucherRequest request) {
        Voucher voucher = voucherMapper.toEntity(request);
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(voucher);
    }

    @Override
    public VoucherResponse update(Integer id, VoucherRequest request) {
        Voucher voucher = voucherMapper.toEntity(id,request);
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toResponse(voucher);
    }
}
