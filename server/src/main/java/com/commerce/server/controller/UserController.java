package com.commerce.server.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commerce.server.dto.RegisterRequest;
import com.commerce.server.dto.UserResponse;
import com.commerce.server.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getOne(@PathVariable Long id){
        return ResponseEntity.ok(userService.getUser(id));
    }
    @GetMapping("/list")
    public ResponseEntity<List<UserResponse>> getList(){
        return ResponseEntity.ok(userService.getList());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> editUser(@PathVariable Long id, @Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(userService.editUser(id,request));
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(){
        return ResponseEntity.ok(userService.getMe());
    }
}
