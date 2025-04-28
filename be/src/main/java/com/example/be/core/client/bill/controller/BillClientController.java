package com.example.be.core.client.bill.controller;

import com.example.be.core.admin.account.dto.response.ResponseData;
import com.example.be.core.client.auth.service.AuthService;
import com.example.be.core.client.bill.respones.BillRespones;
import com.example.be.core.client.bill.service.BillServiceClient;
import com.example.be.entity.Account;
import com.example.be.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bill/client")
public class BillClientController {

    @Autowired
    BillServiceClient billServiceClient;
    @Autowired
    BillRepository billRepository;
    private final AuthService authService;


    @GetMapping
    public ResponseData<List<?>> getBillResponsesByAccount(@RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {
        Account account = authService.findAccountByJwt(jwt);

        List<BillRespones> billResponesList = billServiceClient.getBillsByAccount(account.getId());
        return new ResponseData<>(HttpStatus.OK, "ok", billResponesList);
    }

    @GetMapping("/get-all/{idBill}")
    public ResponseData<?> getAllBillResponses(@PathVariable("idBill")Integer idBill )  {

        BillRespones billRespones= billServiceClient.getAllBillByAccount(idBill);
        return new ResponseData<>(HttpStatus.OK, "ok", billRespones);
    }
    @GetMapping("/findBillByMaBill/{maBill}")
    public ResponseEntity<?> findBillByMaBill(@PathVariable("maBill")String maBill){
        Integer idBill = billRepository.findBillByMaBill(maBill);
        if (idBill.describeConstable().isEmpty()){
            throw new RuntimeException("Mã hóa đơn bị sai vui lòng thử lại");
        }
        BillRespones billHistoryRespones = billServiceClient.getAllBillByAccount(idBill);
        return ResponseEntity.ok(billHistoryRespones);
    }
}
