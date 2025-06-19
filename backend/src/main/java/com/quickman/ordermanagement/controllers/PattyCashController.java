package com.quickman.ordermanagement.controllers;

import com.quickman.ordermanagement.dtos.PattyCashRequest;
import com.quickman.ordermanagement.services.PattyCashService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/pattycash")
public class PattyCashController {

    @Autowired
    private PattyCashService pattyCashService;

    @PostMapping("/receive")
    public String receivePattyCash(@RequestBody PattyCashRequest request) {
        LocalDateTime localDateTime = LocalDateTime.now();
        pattyCashService.receivePattyCash(request.getUserId(), request.getPattyCash(), localDateTime);
        return "Patty Cash received successfully";
    }
    
}