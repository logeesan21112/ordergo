package com.quickman.ordermanagement.services.impl;

import com.quickman.ordermanagement.models.PattyCash;
import com.quickman.ordermanagement.repositories.PattyCashRepository;
import com.quickman.ordermanagement.services.PattyCashService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PattyCashServiceImpl implements PattyCashService {

    @Autowired
    private PattyCashRepository pattyCashRepository;

    @Override
    public void receivePattyCash(Long userId, BigDecimal amount, LocalDateTime date) {
        PattyCash pattyCash = new PattyCash();
        pattyCash.setUserId(userId);
        pattyCash.setPattyCash(amount);
        pattyCash.setDate(date);

        pattyCashRepository.save(pattyCash);
    }
}
