package com.example.be.core.admin.voucher.mapper;

import com.example.be.core.admin.voucher.dto.model.VoucherDTO;
import com.example.be.core.admin.voucher.dto.request.VoucherRequest;
import com.example.be.core.admin.voucher.dto.response.VoucherResponse;
import com.example.be.entity.Voucher;
import com.example.be.repository.VoucherAccountRepository;
import com.example.be.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VoucherMapper {
    private final VoucherRepository voucherRepository;
    private final VoucherAccountRepository voucherAccountRepository;

    public VoucherDTO toDTO(Voucher voucher) {
        VoucherDTO dto = new VoucherDTO();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setName(voucher.getName());
        dto.setConditionPriceMin(voucher.getConditionPriceMin());
        dto.setConditionPriceMax(voucher.getConditionPriceMax());
        dto.setDiscountValue(voucher.getDiscountValue());
        dto.setMaxDiscountAmount(voucher.getMaxDiscountAmount());
        dto.setVoucherType(voucher.getVoucherType());
        dto.setQuantity(voucher.getQuantity());
        dto.setStartTime(voucher.getStartTime());
        dto.setEndTime(voucher.getEndTime());
        dto.setStatus(voucher.getStatus());
        dto.setMoTa(voucher.getMoTa());
        dto.setIsPrivate(voucher.getIsPrivate());
        return dto;
    }

    public Voucher toEntity(Integer id, VoucherRequest request) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new RuntimeException("ID not found")
        );

        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setConditionPriceMin(request.getConditionPriceMin());
        voucher.setConditionPriceMax(request.getConditionPriceMax());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());
        voucher.setVoucherType(request.getVoucherType());
        voucher.setQuantity(request.getQuantity());
        voucher.setStartTime(request.getStartTime());
        voucher.setEndTime(request.getEndTime());
        voucher.setStatus(request.getStatus());
        voucher.setMoTa(request.getMoTa());
        voucher.setIsPrivate(request.getIsPrivate());
        return voucher;

    }

    public Voucher toEntity(VoucherRequest request) {
        Voucher voucher = new Voucher();
        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setConditionPriceMin(request.getConditionPriceMin());
        voucher.setConditionPriceMax(request.getConditionPriceMax());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());
        voucher.setVoucherType(request.getVoucherType());
        voucher.setQuantity(request.getQuantity());
        voucher.setStartTime(request.getStartTime());
        voucher.setEndTime(request.getEndTime());
        voucher.setStatus(request.getStatus());
        voucher.setMoTa(request.getMoTa());
        voucher.setIsPrivate(request.getIsPrivate());
        return voucher;
    }

    public VoucherResponse toResponse(Voucher voucher) {
        Boolean apply = voucherAccountRepository.existsByIdVoucher(voucher);

        VoucherResponse respone = new VoucherResponse();
        respone.setId(voucher.getId());
        respone.setCode((voucher.getCode()));
        respone.setName(voucher.getName());
        respone.setConditionPriceMin(voucher.getConditionPriceMin());
        respone.setConditionPriceMax(voucher.getConditionPriceMax());
        respone.setDiscountValue(voucher.getDiscountValue());
        respone.setMaxDiscountAmount(voucher.getMaxDiscountAmount());
        respone.setVoucherType(voucher.getVoucherType());
        respone.setQuantity(voucher.getQuantity());
        respone.setStartTime(voucher.getStartTime());
        respone.setEndTime((voucher.getEndTime()));
        respone.setStatus(voucher.getStatus());
        respone.setMoTa(voucher.getMoTa());
        respone.setIsPrivate(voucher.getIsPrivate());
        respone.setIsApply(apply);
        return respone;

    }

}
