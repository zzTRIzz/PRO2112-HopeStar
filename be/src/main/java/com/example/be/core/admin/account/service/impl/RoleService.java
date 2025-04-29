package com.example.be.core.admin.account.service.impl;

import com.example.be.core.admin.account.dto.request.RoleRequest;
import com.example.be.entity.Role;
import com.example.be.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    public Role create(RoleRequest request){
        Role role = new Role();
        role.setCode("ROLE_"+request.getCode());
        role.setName(request.getName());
        return roleRepository.save(role);
    }
}
