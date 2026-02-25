package com.actforgood.user.controller;

import com.actforgood.user.dto.*;
import com.actforgood.user.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUser(@PathVariable UUID id) {
        log.info("GET /api/users/{}", id);

        UserDTO user = userService.getUserById(id);

        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserByEmail(@PathVariable String email) {
        log.info("GET /api/users/email/{}", email);

        UserDTO user = userService.getUserByEmail(email);

        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/users - Paginated list: page={}, size={}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = userService.getAllUsers(pageable);

        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getUsersByType(
        @PathVariable String type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/users/type/{} - page={}, size={}", type, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = userService.getUsersByType(
            java.util.Arrays.stream(com.actforgood.user.model.User.UserType.values())
                .filter(ut -> ut.name().equalsIgnoreCase(type))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid user type: " + type)),
            pageable
        );

        return ResponseEntity.ok(ApiResponse.success("Users by type retrieved successfully", users));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> searchUsers(
        @RequestParam String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/users/search?query={} - page={}, size={}", query, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = userService.searchUsers(query, pageable);

        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", users));
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<ApiResponse<?>> validateAndSendPassword(@PathVariable UUID id) {
        log.info("POST /api/users/{}/validate", id);

        userService.validateUserAndSendPasswordByEmail(id);

        return ResponseEntity.ok(ApiResponse.success("User validated and password sent via email", null));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<?>> activateUser(@PathVariable UUID id) {
        log.info("PUT /api/users/{}/activate", id);

        userService.activateUser(id);

        return ResponseEntity.ok(ApiResponse.success("User activated successfully", null));
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<ApiResponse<?>> suspendUser(@PathVariable UUID id) {
        log.info("PUT /api/users/{}/suspend", id);

        userService.suspendUser(id);

        return ResponseEntity.ok(ApiResponse.success("User suspended successfully", null));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<?>> deactivateUser(@PathVariable UUID id) {
        log.info("PUT /api/users/{}/deactivate", id);

        userService.deactivateUser(id);

        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully", null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        log.info("PUT /api/users/{}", id);

        UserDTO updated = userService.updateUser(id, request);

        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable UUID id) {
        log.info("DELETE /api/users/{}", id);

        userService.deleteUser(id);

        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
