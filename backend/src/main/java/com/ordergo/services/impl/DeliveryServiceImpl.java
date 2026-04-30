package com.ordergo.services.impl;

import com.ordergo.dtos.*;
import com.ordergo.exceptions.NotFoundException;
import com.ordergo.models.*;
import com.ordergo.repositories.*;
import com.ordergo.services.DeliveryService;
import com.ordergo.repositories.specification.DeliveryFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public Response addDelivery(DeliveryRequest deliveryRequest) {
        Vendor vendor = vendorRepository.findById(deliveryRequest.getVendorId())
                .orElseThrow(() -> new NotFoundException("Vendor not found"));
        User user = userRepository.findById(deliveryRequest.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Delivery delivery = Delivery.builder()
                .incomeType(deliveryRequest.getIncomeType())
                .paymentStatus(deliveryRequest.getPaymentStatus())
                .paymentType(deliveryRequest.getPaymentType())
                .vendor(vendor)
                .user(user)
                .deliveryCharge(deliveryRequest.getDeliveryCharge())
                .cardOrOnlinePayment(deliveryRequest.getCardOrOnlinePayment())
                .description(deliveryRequest.getDescription())
                .location(deliveryRequest.getLocation())
                .updatedAt(LocalDateTime.now())
                .build();

        deliveryRepository.save(delivery);

        return Response.builder()
                .status(200)
                .message("Delivery saved successfully")
                .build();
    }

    @Override
    public Response getAllDeliveries(int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Specification<Delivery> spec = DeliveryFilter.byFilter(filter);
        Specification<Delivery> notDeleted = (root, query, cb) -> cb.isFalse(root.get("isDeleted"));
        spec = spec == null ? notDeleted : spec.and(notDeleted);

        Page<Delivery> deliveryPage = deliveryRepository.findAll(spec, pageable);
        List<DeliveryDTO> deliveryDTOs = deliveryPage.getContent().stream()
                .map(this::mapToDeliveryDTO)
                .toList();

        return Response.builder()
                .status(200)
                .message("success")
                .deliveries(deliveryDTOs)
                .totalElements(deliveryPage.getTotalElements())
                .totalPages(deliveryPage.getTotalPages())
                .build();
    }

    @Override
    public Response getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Delivery not found"));
        DeliveryDTO deliveryDTO = modelMapper.map(delivery, DeliveryDTO.class);
        deliveryDTO.getUser().setDeliveries(null);

        return Response.builder()
                .status(200)
                .message("success")
                .delivery(deliveryDTO)
                .build();
    }

    @Override
    public Response getDeliveriesByMonthAndYear(int month, int year) {
        List<Delivery> deliveries = deliveryRepository.findAll(DeliveryFilter.byMonthAndYear(month, year));
        List<DeliveryDTO> deliveryDTOs = modelMapper.map(deliveries, new TypeToken<List<DeliveryDTO>>() {}.getType());
        deliveryDTOs.forEach(dto -> {
            dto.setUser(null);
            dto.setVendor(null);
        });

        return Response.builder()
                .status(200)
                .message("success")
                .deliveries(deliveryDTOs)
                .build();
    }

    @Override
    public Response updateDeliveryStatus(Long deliveryId, String deliveryStatus) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new NotFoundException("Delivery not found"));
        delivery.setPaymentStatus(deliveryStatus);
        delivery.setUpdatedAt(LocalDateTime.now());
        deliveryRepository.save(delivery);

        return Response.builder()
                .status(200)
                .message("Delivery status updated successfully")
                .build();
    }

    @Override
    public Response getAllDeliveryLocations() {
        List<DeliveryDTO> locationDTOs = deliveryRepository.findAll().stream()
                .map(d -> DeliveryDTO.builder().location(d.getLocation()).build())
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Delivery locations fetched successfully")
                .deliveries(locationDTOs)
                .build();
    }

    @Override
    public Response updateDelivery(Long deliveryId, DeliveryRequest request) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new NotFoundException("Delivery not found"));

        if (request.getDeliveryCharge() != null) delivery.setDeliveryCharge(request.getDeliveryCharge());
        if (request.getCardOrOnlinePayment() != null) delivery.setCardOrOnlinePayment(request.getCardOrOnlinePayment());
        if (request.getIncomeType() != null && !request.getIncomeType().isBlank()) delivery.setIncomeType(request.getIncomeType());
        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) delivery.setPaymentStatus(request.getPaymentStatus());
        if (request.getPaymentType() != null && !request.getPaymentType().isBlank()) delivery.setPaymentType(request.getPaymentType());
        if (request.getDescription() != null && !request.getDescription().isBlank()) delivery.setDescription(request.getDescription());
        if (request.getLocation() != null && !request.getLocation().isBlank()) delivery.setLocation(request.getLocation());

        delivery.setUpdatedAt(LocalDateTime.now());
        deliveryRepository.save(delivery);

        return Response.builder()
                .status(200)
                .message("Delivery updated successfully")
                .build();
    }

    @Override
    public Response deleteDeliveryById(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new NotFoundException("Delivery not found with id: " + deliveryId));
        delivery.setDeleted(true);
        delivery.setUpdatedAt(LocalDateTime.now());
        deliveryRepository.save(delivery);

        return Response.builder()
                .status(200)
                .message("Delivery deleted successfully")
                .build();
    }

    private DeliveryDTO mapToDeliveryDTO(Delivery delivery) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(delivery.getId());
        dto.setDeliveryCharge(delivery.getDeliveryCharge());
        dto.setCardOrOnlinePayment(delivery.getCardOrOnlinePayment());
        dto.setIncomeType(delivery.getIncomeType());
        dto.setPaymentStatus(delivery.getPaymentStatus());
        dto.setPaymentType(delivery.getPaymentType());
        dto.setDescription(delivery.getDescription());
        dto.setLocation(delivery.getLocation());
        dto.setCreatedAt(delivery.getCreatedAt());
        dto.setUpdatedAt(delivery.getUpdatedAt());

        if (delivery.getUser() != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(delivery.getUser().getId());
            userDTO.setName(delivery.getUser().getName());
            userDTO.setImageUrl(delivery.getUser().getImageUrl());
            dto.setUser(userDTO);
        }

        if (delivery.getVendor() != null) {
            VendorDTO vendorDTO = new VendorDTO();
            vendorDTO.setId(delivery.getVendor().getId());
            vendorDTO.setName(delivery.getVendor().getName());
            vendorDTO.setImageUrl(delivery.getVendor().getImageUrl());
            dto.setVendor(vendorDTO);
        }

        return dto;
    }
}