package com.dishaspora.order.controller;

import com.dishaspora.auth.entity.User;
import com.dishaspora.order.dto.OrderDtos.CheckoutResponse;
import com.dishaspora.order.dto.OrderDtos.CreateOrderRequest;
import com.dishaspora.order.dto.OrderDtos.OrderDto;
import com.dishaspora.order.dto.OrderDtos.VerifyRequest;
import com.dishaspora.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<CheckoutResponse> create(@Valid @RequestBody CreateOrderRequest request,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request, user));
    }

    @PostMapping("/{id}/verify")
    public OrderDto verify(@PathVariable Long id, @Valid @RequestBody VerifyRequest request,
                           @AuthenticationPrincipal User user) {
        return orderService.verify(id, request.reference(), user);
    }

    @GetMapping
    public List<OrderDto> myOrders(@AuthenticationPrincipal User user) {
        return orderService.myOrders(user);
    }

    @GetMapping("/{id}")
    public OrderDto get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return orderService.get(id, user);
    }
}
