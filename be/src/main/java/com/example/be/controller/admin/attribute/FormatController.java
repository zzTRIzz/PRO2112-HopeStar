package com.example.be.controller.admin.attribute;

import com.example.be.response.ApiResponse;

import com.example.be.service.base.GenericService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequiredArgsConstructor
public class FormatController<E,S extends GenericService<E, Integer>> {

    protected final S s;

    @GetMapping()
    public ResponseEntity<List<E>> getAll(){
        List<E> list =s.getAll();
        return ResponseEntity.ok(list);
    }
    @PostMapping("")
    public ResponseEntity<E> create(@RequestBody E e){
        E newE = s.create(e);
        return ResponseEntity.ok(newE);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> update(@PathVariable Integer id,
                                              @RequestBody E e) throws Exception {
        s.update(id,e);
        ApiResponse res = new ApiResponse();
        res.setMessage("update successfully");
        return ResponseEntity.ok(res);
    }

}
