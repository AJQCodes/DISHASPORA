package com.dishaspora.order.controller;

import com.dishaspora.auth.entity.User;
import com.dishaspora.order.dto.OrderDtos.OrderDto;
import com.dishaspora.order.dto.OrderDtos.UpdateStatusRequest;
import com.dishaspora.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor/orders")
public class VendorOrderController {

    private final OrderService orderService;

    public VendorOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderDto> vendorOrders(@AuthenticationPrincipal User user) {
        return orderService.vendorOrders(user);
    }

    @PutMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request,
                                 @AuthenticationPrincipal User user) {
        return orderService.updateStatus(id, request.status(), user);
    }
}
