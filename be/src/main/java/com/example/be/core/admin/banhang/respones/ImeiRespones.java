package com.example.be.core.admin.banhang.respones;

import com.example.be.entity.ProductDetail;
import com.example.be.entity.status.StatusImei;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ImeiRespones {
    private Integer id;

    private String imeiCode;

    private String barCode;

    private StatusImei status;

}
