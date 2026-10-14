package com.commerce.backend.controller;

import com.commerce.backend.dto.AnalyticsDto.DashboardAnalyticsResponse;
import com.commerce.backend.dto.AnalyticsDto.OverviewStats;
import com.commerce.backend.service.AnalyticsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AnalyticsService analyticsService;

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    @DisplayName("Admin dashboard statistikalarini ko'ra oladi")
    void testGetDashboardAnalyticsAsAdmin() throws Exception {
        DashboardAnalyticsResponse response = DashboardAnalyticsResponse.builder()
                .overview(OverviewStats.builder()
                        .totalRevenue(1500.0)
                        .totalOrders(10)
                        .totalProducts(25)
                        .totalUsers(8)
                        .build())
                .ordersByStatus(Map.of("PENDING", 2L))
                .usersByRole(Map.of("USER", 6L, "ADMIN", 2L))
                .dailySales(List.of())
                .topProducts(List.of())
                .lowStockProducts(List.of())
                .recentOrders(List.of())
                .build();

        when(analyticsService.getDashboardAnalytics()).thenReturn(response);

        mockMvc.perform(get("/admin/analytics/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.overview.totalRevenue").value(1500.0))
                .andExpect(jsonPath("$.overview.totalOrders").value(10))
                .andExpect(jsonPath("$.overview.totalProducts").value(25));
    }

    @Test
    @WithMockUser(username = "manager@test.com", roles = "MANAGER")
    @DisplayName("Manager ham dashboard statistikalarini ko'ra oladi")
    void testGetDashboardAnalyticsAsManager() throws Exception {
        DashboardAnalyticsResponse response = DashboardAnalyticsResponse.builder()
                .overview(OverviewStats.builder()
                        .totalRevenue(2000.0)
                        .build())
                .build();

        when(analyticsService.getDashboardAnalytics()).thenReturn(response);

        mockMvc.perform(get("/admin/analytics/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.overview.totalRevenue").value(2000.0));
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    @DisplayName("Oddiy User statistikaga kira olmaydi (403 Forbidden)")
    void testGetDashboardAnalyticsAsUserForbidden() throws Exception {
        mockMvc.perform(get("/admin/analytics/overview"))
                .andExpect(status().isForbidden());
    }
}
