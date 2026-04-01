package com.commerce.server.service;

import com.commerce.server.dto.PasswordService;
import com.commerce.server.dto.RegisterRequest;
import com.commerce.server.entity.User;
import com.commerce.server.enums.Role;
import com.commerce.server.exception.BadRequestException;
import com.commerce.server.exception.NotFoundException;
import com.commerce.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserManagementService {
    private final UserRepository userRepository;
    private final PasswordService passwordService;

    public User findUser(String email){
        return userRepository.findByEmail(email).orElseThrow(()->new NotFoundException("User not found"));
    }
    public User findUser(Long id){
        return userRepository.findById(id).orElseThrow(()->new NotFoundException("User not found"));
    }
    @Transactional
    public User saveUser(User user){
        return userRepository.save(user);
    }
    public void removeUser(User user){
        userRepository.delete(user);
    }
    public void existUser(String email){
        if (userRepository.findByEmail(email).isPresent()){
            throw new BadRequestException("User already exist");
        }
    }
    public User create(RegisterRequest request){
        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        passwordService.hashedPassword(request.getPassword(), user);
        user.setRole(Role.USER);
        return saveUser(user);
    }
}
