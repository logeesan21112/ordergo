package com.quickman.ordermanagement.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PattyCashService {
    void receivePattyCash(Long userId, BigDecimal pattyCash, LocalDateTime localDate);
}