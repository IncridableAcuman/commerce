package com.commerce.server.service;

import com.commerce.server.dto.RegisterRequest;
import com.commerce.server.dto.UserResponse;
import com.commerce.server.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserManagementService userManagementService;

    public UserResponse getUser(Long id){
        User user = userManagementService.findUser(id);
        return UserResponse.from(user);
    }
    public List<UserResponse> getList(){
        List<User> users = userManagementService.userList();
        return users
                .stream()
                .map(UserResponse::from).toList();
    }
    public void deleteUser(Long id){
        User user = userManagementService.findUser(id);
        userManagementService.deleteUser(user);
    }
    public UserResponse editUser(Long id, RegisterRequest request){
        User user = userManagementService.findUser(id);
        User updatedUser = userManagementService.updateUser(user,request);
        return UserResponse.from(updatedUser);
    }
}
