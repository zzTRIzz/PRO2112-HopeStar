package com.example.be.core.admin.banhang.dto;

import com.example.be.entity.Imei;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ImeiSoldDto {

    private List<Integer> id_Imei;

    private Integer idBillDetail;
}
