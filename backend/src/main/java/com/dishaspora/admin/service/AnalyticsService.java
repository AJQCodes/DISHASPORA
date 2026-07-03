package com.dishaspora.admin.service;

import com.dishaspora.auth.repository.UserRepository;
import com.dishaspora.common.enums.Enums.OrderStatus;
import com.dishaspora.marketplace.repository.ListingRepository;
import com.dishaspora.marketplace.repository.VendorRepository;
import com.dishaspora.order.entity.Order;
import com.dishaspora.order.repository.OrderRepository;
import com.dishaspora.order.service.OrderService;
import com.dishaspora.recipe.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final RecipeRepository recipeRepository;
    private final ListingRepository listingRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public AnalyticsService(UserRepository userRepository,
                            VendorRepository vendorRepository,
                            RecipeRepository recipeRepository,
                            ListingRepository listingRepository,
                            OrderRepository orderRepository,
                            OrderService orderService) {
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.recipeRepository = recipeRepository;
        this.listingRepository = listingRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public Map<String, Object> analytics() {
        List<Order> allOrders = orderRepository.findAll();

        long revenueGHS = 0;
        long revenueNGN = 0;
        for (Order order : allOrders) {
            if (order.getStatus() == OrderStatus.PENDING_PAYMENT
                    || order.getStatus() == OrderStatus.CANCELLED) continue;
            if ("NGN".equals(order.getCurrency())) {
                revenueNGN += order.getTotalMinor();
            } else {
                revenueGHS += order.getTotalMinor();
            }
        }
        Map<String, Object> revenueByCurrency = new LinkedHashMap<>();
        revenueByCurrency.put("GHS", revenueGHS);
        revenueByCurrency.put("NGN", revenueNGN);

        Map<String, Object> byCountry = new LinkedHashMap<>();
        for (String country : List.of("GH", "NG")) {
            String currency = "NG".equals(country) ? "NGN" : "GHS";
            long orders = allOrders.stream().filter(o -> currency.equals(o.getCurrency())).count();
            Map<String, Object> stats = new LinkedHashMap<>();
            stats.put("users", userRepository.countByCountry(country));
            stats.put("orders", orders);
            byCountry.put(country, stats);
        }

        // Orders per day over the last 7 days (inclusive of today).
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<Map<String, Object>> ordersPerDay = new java.util.ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            long count = allOrders.stream()
                    .filter(o -> o.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDate().equals(day))
                    .count();
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", day.toString());
            entry.put("count", count);
            ordersPerDay.add(entry);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("users", userRepository.count());
        response.put("vendors", vendorRepository.count());
        response.put("recipes", recipeRepository.count());
        response.put("listings", listingRepository.count());
        response.put("orders", (long) allOrders.size());
        response.put("revenueMinorByCurrency", revenueByCurrency);
        response.put("premiumUsers", userRepository.countByPremiumTrue());
        response.put("byCountry", byCountry);
        response.put("recentOrders", orderRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(orderService::toDto).toList());
        response.put("ordersPerDay", ordersPerDay);
        return response;
    }
}
