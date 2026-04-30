package com.ordergo.services.impl;

import com.ordergo.models.PettyCash;
import com.ordergo.repositories.PettyCashRepository;
import com.ordergo.services.PettyCashService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PettyCashServiceImpl implements PettyCashService {

    private final PettyCashRepository pettyCashRepository;

    @Override
    public void receivePettyCash(Long userId, BigDecimal amount, LocalDateTime date) {
        PettyCash pettyCash = new PettyCash();
        pettyCash.setUserId(userId);
        pettyCash.setPettyCash(amount);
        pettyCash.setCreatedAt(date);
        pettyCashRepository.save(pettyCash);
    }
}