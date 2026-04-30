package com.ordergo.controllers;

import com.ordergo.dtos.VendorDTO;
import com.ordergo.dtos.Response;
import com.ordergo.services.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> saveVendor(
            @RequestParam(required = false) MultipartFile imageFile,
            @RequestParam String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam String phoneNumber) {

        VendorDTO vendorDTO = new VendorDTO();
        vendorDTO.setName(name);
        vendorDTO.setEmail(email);
        vendorDTO.setAddress(address);
        vendorDTO.setPhoneNumber(phoneNumber);
        return ResponseEntity.ok(vendorService.saveVendor(vendorDTO, imageFile));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateVendor(
            @RequestParam Long vendorId,
            @RequestParam(required = false) MultipartFile imageFile,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String phoneNumber) {

        VendorDTO vendorDTO = new VendorDTO();
        vendorDTO.setVendorId(vendorId);
        vendorDTO.setName(name);
        vendorDTO.setEmail(email);
        vendorDTO.setAddress(address);
        vendorDTO.setPhoneNumber(phoneNumber);
        return ResponseEntity.ok(vendorService.updateVendor(vendorDTO, imageFile));
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.deleteVendor(id));
    }
}