package com.actforgood.user.service;

import com.actforgood.user.dto.AuthResponse;
import com.actforgood.user.dto.LoginRequest;
import com.actforgood.user.dto.RegisterRequest;
import com.actforgood.user.model.User;
import com.actforgood.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * Inscription : pas de mot de passe saisi par l'utilisateur.
 * Le mot de passe est envoyé par email après validation par l'administrateur.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    /**
     * Inscription : crée un utilisateur en PENDING_VALIDATION (pas de mot de passe).
     * L'admin valide puis le mot de passe est envoyé par email.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un compte existe déjà avec cet email");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName() != null ? request.getLastName() : "");
        user.setPhone(request.getPhone());
        user.setUserType(request.getUserType());
        user.setLocation(request.getLocation());
        user.setCountry(request.getCountry());
        user.setStatus(User.UserStatus.PENDING_VALIDATION);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Si un mot de passe est fourni (ex: tests), on l'enregistre et on active le compte
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setStatus(User.UserStatus.ACTIVE);
        } else {
            user.setPassword(null);
        }

        user = userRepository.save(user);

        // Connexion automatique uniquement si le compte a été activé (mot de passe fourni)
        if (user.getStatus() == User.UserStatus.ACTIVE) {
            String token = jwtService.generateToken(user);
            return new AuthResponse(
                    token,
                    String.valueOf(user.getId()),
                    user.getEmail(),
                    user.getUserType().name(),
                    3600L
            );
        }

        // Compte en attente de validation : pas de token
        return new AuthResponse(
                null,
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getUserType().name(),
                0L
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Identifiants incorrects"));

        if (user.getPassword() == null) {
            throw new RuntimeException("Compte en attente de validation. Le mot de passe vous sera envoyé par email après validation.");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Identifiants incorrects");
        }
        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("Compte non actif");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(
                token,
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getUserType().name(),
                3600L
        );
    }

    /**
     * Validation par l'admin : génère un mot de passe, l'enregistre et l'envoie par email.
     */
    @Transactional
    public void validateUserAndSendPasswordByEmail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (user.getStatus() != User.UserStatus.PENDING_VALIDATION) {
            throw new RuntimeException("Utilisateur déjà validé ou non en attente");
        }

        String plainPassword = generateRandomPassword();
        user.setPassword(passwordEncoder.encode(plainPassword));
        user.setStatus(User.UserStatus.ACTIVE);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        emailService.sendPasswordByEmail(user.getEmail(), user.getFirstName(), plainPassword);
    }

    private static String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[12];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes).replaceAll("[^a-zA-Z0-9]", "").substring(0, 12);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }
}
