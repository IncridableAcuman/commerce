package com.commerce.backend.service;

import com.commerce.backend.dto.UserDto.UpdateRoleRequest;
import com.commerce.backend.dto.UserDto.UpdateUserStatusRequest;
import com.commerce.backend.dto.UserDto.UserResponse;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.entity.enums.Role;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(String search, Role role, Pageable pageable) {
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasRole = role != null;

        Page<UserEntity> users;
        if (hasSearch && hasRole) {
            users = userRepository.findByRoleAndSearch(role, search.trim(), pageable);
        } else if (hasSearch) {
            users = userRepository.findBySearch(search.trim(), pageable);
        } else if (hasRole) {
            users = userRepository.findByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(UserResponse::from);
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, UpdateRoleRequest request, Authentication authentication) {
        UserEntity targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi (ID: " + userId + ")"));

        Role oldRole = targetUser.getRole();
        Role newRole = request.getRole();

        if (oldRole == newRole) {
            return UserResponse.from(targetUser);
        }

        String currentAdminEmail = authentication != null ? authentication.getName() : null;

        // Xavfsizlik 1: Admin o'zining rolini o'zi pasaytira olmaydi
        if (targetUser.getEmail().equalsIgnoreCase(currentAdminEmail) && newRole != Role.ADMIN) {
            throw new CustomBadRequestException("Administrator o'zining rolini pasaytira olmaydi");
        }

        // Xavfsizlik 2: Tizimda kamida bitta faol ADMIN qolishi shart
        if (oldRole == Role.ADMIN && newRole != Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new CustomBadRequestException("Tizimda kamida bitta Administrator (ADMIN) bo'lishi shart");
            }
        }

        targetUser.setRole(newRole);
        UserEntity saved = userRepository.save(targetUser);
        log.info("Foydalanuvchi #{} ({}) roli o'zgartirildi: {} -> {} (Amalni bajardi: {})",
                targetUser.getId(), targetUser.getEmail(), oldRole, newRole, currentAdminEmail);

        return UserResponse.from(saved);
    }

    @Transactional
    public UserResponse updateUserStatus(Long userId, UpdateUserStatusRequest request, Authentication authentication) {
        UserEntity targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi (ID: " + userId + ")"));

        String currentAdminEmail = authentication != null ? authentication.getName() : null;

        // Admin o'zining akkauntini nofaol qila olmaydi
        if (targetUser.getEmail().equalsIgnoreCase(currentAdminEmail) && Boolean.FALSE.equals(request.getEnabled())) {
            throw new CustomBadRequestException("Administrator o'z akkauntini bloklay olmaydi");
        }

        targetUser.setEnabled(request.getEnabled());
        UserEntity saved = userRepository.save(targetUser);
        log.info("Foydalanuvchi #{} ({}) holati o'zgartirildi: enabled={} (Amalni bajardi: {})",
                targetUser.getId(), targetUser.getEmail(), request.getEnabled(), currentAdminEmail);

        return UserResponse.from(saved);
    }
}
