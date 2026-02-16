package com.actforgood.user.controller;

import com.actforgood.user.model.User;
import com.actforgood.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Validation par l'admin : envoi du mot de passe par email et activation du compte.
     */
    @PostMapping("/{id}/validate")
    public ResponseEntity<Void> validateAndSendPassword(@PathVariable Long id) {
        try {
            userService.validateUserAndSendPasswordByEmail(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
