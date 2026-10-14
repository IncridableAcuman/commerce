package com.commerce.backend.service;

import com.commerce.backend.dto.UserDto;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;

    @Transactional(readOnly = true)
    public UserDto.UserResponse getProfile(String email) {
        log.info("Profil so'rovi: {}", email);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi: " + email));
        return UserDto.UserResponse.from(user);
    }

    @Transactional
    public UserDto.UserResponse updateProfile(String email, UserDto.ProfileUpdateRequest request) {
        log.info("Profilni yangilash so'rovi: {}", email);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi: " + email));

        // Agar foydalanuvchi nomi o'zgartirilayotgan bo'lsa va boshqa foydalanuvchida mavjud bo'lsa
        if (!user.getUsername().equals(request.getUsername().trim())) {
            boolean usernameExists = userRepository.findAll().stream()
                    .anyMatch(u -> !u.getId().equals(user.getId()) && u.getUsername().equalsIgnoreCase(request.getUsername().trim()));
            if (usernameExists) {
                throw new CustomBadRequestException("Ushbu foydalanuvchi nomi allaqachon band");
            }
            user.setUsername(request.getUsername().trim());
        }

        user.setFullName(request.getFullName().trim());
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress().trim());
        }
        if (request.getAvatar() != null && !request.getAvatar().isBlank()) {
            user.setAvatar(request.getAvatar().trim());
        }

        UserEntity saved = userRepository.save(user);
        log.info("Foydalanuvchi [{}] profili muvaffaqiyatli saqlandi", email);
        return UserDto.UserResponse.from(saved);
    }

    @Transactional
    public void changePassword(String email, UserDto.ChangePasswordRequest request) {
        log.info("Parolni o'zgartirish so'rovi: {}", email);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi: " + email));

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new CustomBadRequestException("Yangi parol va uni tasdiqlash mos kelmadi");
        }

        if (user.getPassword() != null && !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new CustomBadRequestException("Joriy parol noto'g'ri kiritildi");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Foydalanuvchi [{}] paroli muvaffaqiyatli yangilandi", email);
    }

    @Transactional
    public String updateAvatar(String email, MultipartFile file) {
        log.info("Avatar yuklash so'rovi: {}", email);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi: " + email));

        String fileName = fileService.saveFile(file);
        String avatarUrl = "/api/v1/uploads/" + fileName;
        user.setAvatar(avatarUrl);
        userRepository.save(user);
        log.info("Foydalanuvchi [{}] avatari muvaffaqiyatli yuklandi: {}", email, avatarUrl);
        return avatarUrl;
    }
}
