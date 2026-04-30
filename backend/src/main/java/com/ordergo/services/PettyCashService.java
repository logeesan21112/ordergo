package com.ordergo.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PettyCashService {

    void receivePettyCash(Long userId, BigDecimal pettyCash, LocalDateTime date);
}