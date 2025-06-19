package com.quickman.ordermanagement.controllers;

import com.quickman.ordermanagement.dtos.ChargeDTO;
import com.quickman.ordermanagement.dtos.ChargeRequest;
import com.quickman.ordermanagement.services.ChargeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charges")
public class ChargeController {

    @Autowired
    private ChargeService chargeService;

    @PostMapping("/add")
    public ResponseEntity<ChargeDTO> addCharge(@RequestBody ChargeRequest request) {
        return ResponseEntity.ok(chargeService.addCharge(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ChargeDTO>> getAllCharges() {
        return ResponseEntity.ok(chargeService.getAllCharges());
    }
    
    @PutMapping("/edit/{id}")
    public ResponseEntity<ChargeDTO> updateCharge(
            @PathVariable Long id,
            @RequestBody ChargeRequest request) {
        return ResponseEntity.ok(chargeService.updateCharge(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCharge(@PathVariable Long id) {
        chargeService.deleteCharge(id);
        return ResponseEntity.noContent().build();
    }
    
}