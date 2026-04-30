package com.ordergo.controllers;

import com.ordergo.dtos.Response;
import com.ordergo.dtos.DeliveryRequest;
import com.ordergo.services.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/add")
    public ResponseEntity<Response> addDelivery(@RequestBody @Valid DeliveryRequest deliveryRequest) {
        return ResponseEntity.ok(deliveryService.addDelivery(deliveryRequest));
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllDeliveries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(required = false) String filter) {
        return ResponseEntity.ok(deliveryService.getAllDeliveries(page, size, filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getDeliveryById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }

    @GetMapping("/by-month-year")
    public ResponseEntity<Response> getDeliveriesByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByMonthAndYear(month, year));
    }

    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<Response> updateDeliveryStatus(
            @PathVariable Long deliveryId,
            @RequestBody String deliveryStatus) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, deliveryStatus));
    }

    @GetMapping("/locations")
    public ResponseEntity<Response> getAllLocations() {
        return ResponseEntity.ok(deliveryService.getAllDeliveryLocations());
    }

    @PutMapping("/update/{deliveryId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateDelivery(
            @PathVariable Long deliveryId,
            @RequestBody DeliveryRequest request) {
        return ResponseEntity.ok(deliveryService.updateDelivery(deliveryId, request));
    }

    @DeleteMapping("/delete/{deliveryId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteDelivery(@PathVariable Long deliveryId) {
        return ResponseEntity.ok(deliveryService.deleteDeliveryById(deliveryId));
    }
}