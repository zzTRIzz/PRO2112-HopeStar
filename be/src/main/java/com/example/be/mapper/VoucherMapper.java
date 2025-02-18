package com.example.be.mapper;

import com.example.be.dto.VoucherDTO;
import com.example.be.entity.Voucher;
import com.example.be.entity.status.StatusVoucher;
import com.example.be.repository.VoucherRepository;
import com.example.be.request.product.VoucherRequest;
import com.example.be.response.VoucherResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VoucherMapper {
    private final VoucherRepository voucherRepository;

    public VoucherDTO toDTO(Voucher voucher) {
        VoucherDTO dto = new VoucherDTO();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setName(voucher.getName());
        dto.setConditionPriceMin(voucher.getConditionPriceMin());
        dto.setConditionPriceMax(voucher.getConditionPriceMax());
        dto.setDiscountValue(voucher.getDiscountValue());
        dto.setVoucherType(voucher.getVoucherType());
        dto.setQuantity(voucher.getQuantity());
        dto.setStartTime(voucher.getStartTime());
        dto.setEndTime(voucher.getEndTime());
        dto.setStatus(voucher.getStatus());

        return dto;
    }

    public Voucher toEntity(Integer id,VoucherRequest request) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("ID not found")
        );

        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setConditionPriceMin(request.getConditionPriceMin());
        voucher.setConditionPriceMax(request.getConditionPriceMax());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setVoucherType(request.getVoucherType());
        voucher.setQuantity(request.getQuantity());
        voucher.setStartTime(request.getStartTime());
        voucher.setEndTime(request.getEndTime());
        voucher.setStatus(request.getStatus());

        return voucher;

    }
    public Voucher toEntity(VoucherRequest request) {
        Voucher voucher = new Voucher();
        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setConditionPriceMin(request.getConditionPriceMin());
        voucher.setConditionPriceMax(request.getConditionPriceMax());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setVoucherType(request.getVoucherType());
        voucher.setQuantity(request.getQuantity());
        voucher.setStartTime(request.getStartTime());
        voucher.setEndTime(request.getEndTime());
        voucher.setStatus(request.getStatus());

        return voucher;
    }

    public VoucherResponse toResponse(Voucher voucher) {
        VoucherResponse respone = new VoucherResponse();
        respone.setId(voucher.getId());
        respone.setCode((voucher.getCode()));
        respone.setName(voucher.getName());
        respone.setConditionPriceMin(voucher.getConditionPriceMin());
        respone.setConditionPriceMax(voucher.getConditionPriceMax());
        respone.setDiscountValue(voucher.getDiscountValue());
        respone.setVoucherType(voucher.getVoucherType());
        respone.setQuantity(voucher.getQuantity());
        respone.setStartTime(voucher.getStartTime());
        respone.setEndTime((voucher.getEndTime()));
        respone.setStatus(voucher.getStatus());
        return respone;

    }

}
