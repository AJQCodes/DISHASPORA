package com.dishaspora.order.dto;

import com.dishaspora.common.dto.PaystackInitDto;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.order.entity.Order;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public final class OrderDtos {
    private OrderDtos() {}

    public record OrderItemDto(Long listingId, String title, String imageUrl, int qty, long amountMinor) {}

    public record OrderDto(Long id, String reference, String status, List<OrderItemDto> items,
                           long subtotalMinor, long feeMinor, long deliveryMinor, long totalMinor,
                           String currency, Long vendorId, String vendorName, String createdAt) {

        public static OrderDto from(Order order, Vendor vendor) {
            List<OrderItemDto> items = order.getItems().stream()
                    .map(i -> new OrderItemDto(i.getListingId(), i.getTitle(), i.getImageUrl(),
                            i.getQty(), i.getAmountMinor()))
                    .toList();
            return new OrderDto(order.getId(), order.getReference(), order.getStatus().name(), items,
                    order.getSubtotalMinor(), order.getFeeMinor(), order.getDeliveryMinor(),
                    order.getTotalMinor(), order.getCurrency(), order.getVendorId(),
                    vendor == null ? null : vendor.getName(), order.getCreatedAt().toString());
        }
    }

    public record CreateOrderItem(@NotNull Long listingId, @Min(1) int qty) {}

    public record CreateOrderRequest(@NotEmpty @Valid List<CreateOrderItem> items) {}

    public record VerifyRequest(@NotBlank String reference) {}

    public record UpdateStatusRequest(@NotBlank String status) {}

    public record CheckoutResponse(OrderDto order, PaystackInitDto payment) {}
}
