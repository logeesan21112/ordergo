package com.quickman.ordermanagement.services;

import java.util.List;

import com.quickman.ordermanagement.dtos.ChargeDTO;
import com.quickman.ordermanagement.dtos.ChargeRequest;

public interface ChargeService {
    ChargeDTO addCharge(ChargeRequest request);
    List<ChargeDTO> getAllCharges();
    ChargeDTO updateCharge(Long id, ChargeRequest request);
    void deleteCharge(Long id);
}