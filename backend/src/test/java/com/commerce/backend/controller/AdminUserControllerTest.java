package com.commerce.backend.controller;

import com.commerce.backend.dto.UserDto.UpdateRoleRequest;
import com.commerce.backend.dto.UserDto.UpdateUserStatusRequest;
import com.commerce.backend.dto.UserDto.UserResponse;
import com.commerce.backend.entity.enums.Role;
import com.commerce.backend.service.AdminUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AdminUserService adminUserService;

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    @DisplayName("Admin barcha foydalanuvchilarni ko'ra oladi")
    void testGetAllUsersAsAdmin() throws Exception {
        UserResponse response = UserResponse.builder()
                .id(1L)
                .fullName("Test User")
                .email("user@test.com")
                .role(Role.USER)
                .enabled(true)
                .build();

        when(adminUserService.getAllUsers(any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(response)));

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].email").value("user@test.com"));
    }

    @Test
    @WithMockUser(username = "manager@test.com", roles = "MANAGER")
    @DisplayName("Manager foydalanuvchilar boshqaruviga kira olmaydi (403 Forbidden)")
    void testGetAllUsersAsManagerForbidden() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    @DisplayName("Oddiy User foydalanuvchilar boshqaruviga kira olmaydi (403 Forbidden)")
    void testGetAllUsersAsUserForbidden() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    @DisplayName("Admin foydalanuvchi rolini o'zgartira oladi")
    void testUpdateUserRole() throws Exception {
        UpdateRoleRequest req = new UpdateRoleRequest(Role.MANAGER);
        UserResponse updated = UserResponse.builder()
                .id(2L)
                .email("user2@test.com")
                .role(Role.MANAGER)
                .build();

        when(adminUserService.updateUserRole(eq(2L), any(UpdateRoleRequest.class), any()))
                .thenReturn(updated);

        mockMvc.perform(put("/admin/users/2/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("MANAGER"));
    }
}
