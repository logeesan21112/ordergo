package com.quickman.ordermanagement.services.impl;

import com.quickman.ordermanagement.dtos.ChargeDTO;
import com.quickman.ordermanagement.dtos.ChargeRequest;
import com.quickman.ordermanagement.models.Charge;
import com.quickman.ordermanagement.models.User;
import com.quickman.ordermanagement.repositories.ChargeRepository;
import com.quickman.ordermanagement.repositories.UserRepository;
import com.quickman.ordermanagement.services.ChargeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChargeServiceImpl implements ChargeService {
    @Autowired private ChargeRepository chargeRepository;
    @Autowired private UserRepository userRepository;

    @Override
    public ChargeDTO addCharge(ChargeRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Charge charge = new Charge();
        charge.setUser(user);
        charge.setExpenseType(request.getExpenseType());
        charge.setExpenseAmount(request.getExpenseAmount());
        charge.setDescription(request.getDescription());

        Charge saved = chargeRepository.save(charge);

        return new ChargeDTO(
            saved.getId(),
            user.getName(),
            saved.getExpenseType(),
            saved.getDescription(),
            saved.getExpenseAmount(),
            saved.getDate()
        );
    }

    @Override
    public List<ChargeDTO> getAllCharges() {
        return chargeRepository.findAll().stream()
            .filter(charge -> !charge.isDeleted())
            .map(charge -> new ChargeDTO(
                charge.getId(),
                charge.getUser().getName(),
                charge.getExpenseType(),
                charge.getDescription(),
                charge.getExpenseAmount(),
                charge.getDate()
            ))
            .collect(Collectors.toList());
    }

    @Override
    public ChargeDTO updateCharge(Long id, ChargeRequest request) {
        Charge charge = chargeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Charge not found"));

        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        charge.setUser(user);
        charge.setExpenseType(request.getExpenseType());
        charge.setExpenseAmount(request.getExpenseAmount());
        charge.setDescription(request.getDescription());

        Charge updated = chargeRepository.save(charge);

        return new ChargeDTO(
            updated.getId(),
            user.getName(),
            updated.getExpenseType(),
            updated.getDescription(),
            updated.getExpenseAmount(),
            updated.getDate()
        );
    }

    @Override
    public void deleteCharge(Long id) {
        Charge charge = chargeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Charge not found"));
        charge.setDeleted(true);
        chargeRepository.save(charge);
    }
}