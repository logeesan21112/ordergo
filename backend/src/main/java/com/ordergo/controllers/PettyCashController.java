package com.ordergo.controllers;

import com.ordergo.dtos.PettyCashRequest;
import com.ordergo.services.PettyCashService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/petty-cash")
@RequiredArgsConstructor
public class PettyCashController {

    private final PettyCashService pettyCashService;

    @PostMapping("/receive")
    public String receivePettyCash(@RequestBody PettyCashRequest request) {
        pettyCashService.receivePettyCash(request.getUserId(), request.getPettyCash(), LocalDateTime.now());
        return "Petty cash received successfully";
    }
}