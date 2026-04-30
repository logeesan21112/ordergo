package com.ordergo.services;

import com.ordergo.dtos.Response;
import com.ordergo.dtos.DeliveryRequest;

public interface DeliveryService {

    Response addDelivery(DeliveryRequest deliveryRequest);
    Response getAllDeliveries(int page, int size, String filter);
    Response getDeliveryById(Long id);
    Response getDeliveriesByMonthAndYear(int month, int year);
    Response updateDeliveryStatus(Long deliveryId, String deliveryStatus);
    Response getAllDeliveryLocations();
    Response updateDelivery(Long deliveryId, DeliveryRequest request);
    Response deleteDeliveryById(Long deliveryId);
}