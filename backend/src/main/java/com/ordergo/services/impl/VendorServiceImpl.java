package com.ordergo.services.impl;

import com.ordergo.dtos.VendorDTO;
import com.ordergo.dtos.Response;
import com.ordergo.exceptions.NotFoundException;
import com.ordergo.models.Vendor;
import com.ordergo.repositories.VendorRepository;
import com.ordergo.services.VendorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final ModelMapper modelMapper;

    private static final String IMAGE_DIRECTORY = "E:/quickman-order-management/frontend/public/vendors/";

    @Override
    public Response saveVendor(VendorDTO vendorDTO, MultipartFile imageFile) {
        Vendor vendor = Vendor.builder()
                .name(vendorDTO.getName())
                .email(vendorDTO.getEmail())
                .address(vendorDTO.getAddress())
                .phoneNumber(vendorDTO.getPhoneNumber())
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            vendor.setImageUrl(imagePath);
        }

        vendorRepository.save(vendor);

        return Response.builder()
                .status(200)
                .message("Vendor saved successfully")
                .build();
    }

    @Override
    public Response updateVendor(VendorDTO vendorDTO, MultipartFile imageFile) {
        Vendor vendor = vendorRepository.findById(vendorDTO.getVendorId())
                .orElseThrow(() -> new NotFoundException("Vendor not found"));

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            vendor.setImageUrl(imagePath);
        }

        if (vendorDTO.getName() != null && !vendorDTO.getName().isBlank()) {
            vendor.setName(vendorDTO.getName());
        }

        if (vendorDTO.getEmail() != null && !vendorDTO.getEmail().isBlank()) {
            vendor.setEmail(vendorDTO.getEmail());
        }

        if (vendorDTO.getAddress() != null && !vendorDTO.getAddress().isBlank()) {
            vendor.setAddress(vendorDTO.getAddress());
        }

        if (vendorDTO.getPhoneNumber() != null && vendorDTO.getPhoneNumber().matches("\\d{10}")) {
            vendor.setPhoneNumber(vendorDTO.getPhoneNumber());
        }

        vendorRepository.save(vendor);

        return Response.builder()
                .status(200)
                .message("Vendor updated successfully")
                .build();
    }

    @Override
    public Response getAllVendors() {
        List<Vendor> vendorList = vendorRepository.findByIsDeletedFalseOrderByIdDesc();
        List<VendorDTO> vendorDTOList = modelMapper.map(vendorList, new TypeToken<List<VendorDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .vendors(vendorDTOList)
                .build();
    }

    @Override
    public Response getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .filter(v -> !v.isDeleted())
                .orElseThrow(() -> new NotFoundException("Vendor not found"));

        return Response.builder()
                .status(200)
                .message("success")
                .vendor(modelMapper.map(vendor, VendorDTO.class))
                .build();
    }

    @Override
    public Response deleteVendor(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Vendor not found with id: " + id));

        vendor.setDeleted(true);
        vendor.setName(vendor.getName() + " [deleted]");
        vendor.setEmail(vendor.getEmail() + " [deleted]");
        vendorRepository.save(vendor);

        return Response.builder()
                .status(200)
                .message("Vendor deleted successfully")
                .build();
    }

    private String saveImage(MultipartFile imageFile) {
        if (!imageFile.getContentType().startsWith("image/") || imageFile.getSize() > 1024 * 1024 * 1024) {
            throw new IllegalArgumentException("Only image files under 1GB are allowed");
        }

        File directory = new File(IMAGE_DIRECTORY);
        if (!directory.exists()) {
            directory.mkdir();
        }

        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imagePath = IMAGE_DIRECTORY + uniqueFileName;

        try {
            imageFile.transferTo(new File(imagePath));
        } catch (Exception e) {
            throw new IllegalArgumentException("Error saving image: " + e.getMessage());
        }

        return "vendors/" + uniqueFileName;
    }
}