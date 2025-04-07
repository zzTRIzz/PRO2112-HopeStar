package com.example.be.core.admin.banhang.respones;

import com.example.be.entity.BillDetail;
import com.example.be.entity.Imei;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class ImeiSoldRespone {

    private Integer id;

    private ImeiRespones id_Imei;

}
