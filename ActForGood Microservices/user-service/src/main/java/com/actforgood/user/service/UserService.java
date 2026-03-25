package com.actforgood.user.service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.actforgood.user.dto.AuthResponse;
import com.actforgood.user.dto.CreateUserRequest;
import com.actforgood.user.dto.LoginRequest;
import com.actforgood.user.dto.RegisterRequest;
import com.actforgood.user.dto.UpdateUserRequest;
import com.actforgood.user.dto.UserDTO;
import com.actforgood.user.exception.ResourceNotFoundException;
import com.actforgood.user.exception.ValidationException;
import com.actforgood.user.model.User;
import com.actforgood.user.repository.UserRepository;

import com.actforgood.user.dto.NotificationRequest;
import com.actforgood.user.messaging.NotificationProducer;
import lombok.extern.slf4j.Slf4j;

/**
 * User Service - Gère l'authentification, l'enregistrement et la gestion des
 * utilisateurs
 *
 * Flux d'inscription :
 * 1. L'utilisateur s'enregistre sans mot de passe
 * 2. Compte en PENDING_VALIDATION
 * 3. Admin valide et envoie le mot de passe par email
 * 4. Compte passe en ACTIVE
 */
@Service
@Transactional
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private NotificationProducer notificationProducer;

    // ==================== Registration & Authentication ====================

    /**
     * Enregistrement : crée un utilisateur en PENDING_VALIDATION (pas de mot de
     * passe).
     */
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        validateEmailNotExists(request.getEmail());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName() != null ? request.getLastName() : "");
        user.setPhone(request.getPhone());
        user.setUserType(User.UserType.fromString(request.getUserType()));
        user.setCountry(request.getCountry());
        user.setStatus(User.UserStatus.PENDING_VALIDATION);

        // Map Organization Profile if type is NGO or ORPHANAGE
        if (user.getUserType() == User.UserType.NGO || user.getUserType() == User.UserType.ORPHANAGE) {
            User.OrganizationProfile profile = new User.OrganizationProfile();
            profile.setOrganizationName(request.getOrganizationName());
            profile.setOrganizationType(request.getOrganizationType());
            profile.setCreationYear(request.getCreationYear());
            profile.setWebsiteUrl(request.getWebsite());
            profile.setAddress(request.getAddress());
            profile.setMission(request.getMission());
            profile.setSectors(request.getSectors());
            
            profile.setRccm(request.getRccm());
            profile.setTaxId(request.getTaxId());
            profile.setLegalDocUrl(request.getLegalDocUrl());
            profile.setStatutesUrl(request.getStatutesUrl());
            
            profile.setMinasAuthUrl(request.getMinasAuthUrl());
            profile.setAssocReceiptUrl(request.getAssocReceiptUrl());
            profile.setRulesInternalUrl(request.getRulesInternalUrl());
            profile.setRegistryEntryUrl(request.getRegistryEntryUrl());
            profile.setSocialInquiryUrl(request.getSocialInquiryUrl());
            
            user.setOrganizationProfile(profile);
        }

        // Si un mot de passe est fourni (ex: tests), on l'enregistre et on active le
        // compte
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setStatus(User.UserStatus.ACTIVE);
            log.debug("User registered with password, account activated immediately");
        } else {
            user.setPassword(null);
            log.debug("User registered without password, awaiting admin validation");
        }

        user = userRepository.save(user);
        log.info("User registered successfully with id: {}", user.getId());

        // Connexion automatique uniquement si le compte a été activé
        if (user.isActive()) {
            String token = jwtService.generateToken(user);
            return new AuthResponse(
                    token,
                    user.getId().toString(),
                    user.getEmail(),
                    user.getUserType().name(),
                    3600L);
        }

        // Compte en attente de validation : pas de token
        return new AuthResponse(
                null,
                user.getId().toString(),
                user.getEmail(),
                user.getUserType().name(),
                0L);
    }

    /**
     * Connexion : vérifie les identifiants et retourne un token JWT
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: user not found with email {}", request.getEmail());
                    return new ResourceNotFoundException("User", request.getEmail());
                });

        if (user.getPassword() == null) {
            log.warn("Login failed: user {} not validated yet", user.getId());
            throw new ValidationException(
                    "Compte en attente de validation. Le mot de passe vous sera envoyé par email après validation.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: invalid password for user {}", user.getId());
            throw new ValidationException("Identifiants incorrects");
        }

        if (!user.isActive()) {
            log.warn("Login failed: user {} not active (status: {})", user.getId(), user.getStatus());
            throw new ValidationException("Compte non actif");
        }

        String token = jwtService.generateToken(user);
        log.info("Login successful for user: {}", user.getId());

        return new AuthResponse(
                token,
                user.getId().toString(),
                user.getEmail(),
                user.getUserType().name(),
                3600L);
    }

    // ==================== User Management ====================

    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());

        validateEmailNotExists(request.getEmail());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName() != null ? request.getLastName() : "");
        user.setPhone(request.getPhone());
        user.setUserType(User.UserType.fromString(request.getUserType()));
        user.setLocation(request.getLocation());
        user.setCountry(request.getCountry());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setStatus(User.UserStatus.ACTIVE);
            log.debug("User created with ACTIVE status");
        } else {
            user.setStatus(User.UserStatus.PENDING_VALIDATION);
            log.debug("User created with PENDING_VALIDATION status");
        }

        user = userRepository.save(user);
        log.info("User created successfully with id: {}", user.getId());

        return convertToDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(UUID id) {
        log.debug("Fetching user with id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id.toString()));

        return convertToDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {
        log.debug("Fetching user with email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        return convertToDTO(user);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        log.info("Fetching all users with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        return userRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getUsersByType(User.UserType userType, Pageable pageable) {
        log.info("Fetching users by type: {} with pagination", userType);

        return userRepository.findByUserType(userType, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getUsersByStatus(User.UserStatus status, Pageable pageable) {
        log.info("Fetching users by status: {} with pagination", status);

        return userRepository.findByStatus(status, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> searchUsers(String searchTerm, Pageable pageable) {
        log.info("Searching users by term: {}", searchTerm);

        return userRepository.searchByName(searchTerm, pageable).map(this::convertToDTO);
    }

    @Transactional
    public UserDTO updateUser(UUID id, UpdateUserRequest request) {
        log.info("Updating user with id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id.toString()));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            validateEmailNotExists(request.getEmail());
            user.setEmail(request.getEmail());
            log.debug("User email updated");
        }

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }

        user = userRepository.save(user);
        log.info("User updated successfully with id: {}", id);

        return convertToDTO(user);
    }

    @Transactional
    public void deleteUser(UUID id) {
        log.info("Deleting user with id: {}", id);

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", id.toString());
        }

        userRepository.deleteById(id);
        log.info("User deleted successfully with id: {}", id);
    }

    // ==================== User Validation & Status ====================

    @Transactional
    public void validateUserAndSendPasswordByEmail(UUID userId) {
        log.info("Validating user and sending credentials: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        if (user.getStatus() != User.UserStatus.PENDING_VALIDATION) {
            log.warn("Cannot validate user {}: status is {}", userId, user.getStatus());
            throw new ValidationException("Cet utilisateur n'est pas en attente de validation.");
        }

        String plainPassword = generateRandomPassword();
        user.setPassword(passwordEncoder.encode(plainPassword));
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);

        log.info("User {} validated, publishing approval notification", userId);
        notificationProducer.sendEmailNotification(NotificationRequest.builder()
                .to(user.getEmail())
                .firstName(user.getFirstName())
                .template("APPROVAL")
                .variable(plainPassword)
                .build());
    }

    @Transactional
    public void rejectUser(UUID userId, String reason) {
        log.info("Rejecting user {}: reason={}", userId, reason);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        if (user.getStatus() != User.UserStatus.PENDING_VALIDATION) {
            throw new ValidationException("Impossible de rejeter un utilisateur qui n'est pas en PENDING.");
        }

        user.setStatus(User.UserStatus.INACTIVE);
        userRepository.save(user);

        log.info("User {} rejected, publishing rejection notification", userId);
        notificationProducer.sendEmailNotification(NotificationRequest.builder()
                .to(user.getEmail())
                .firstName(user.getFirstName())
                .template("REJECTION")
                .variable(reason)
                .build());
    }

    @Transactional
    public void activateUser(UUID userId) {
        log.info("Activating user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        user.activate();
        userRepository.save(user);

        log.info("User activated successfully: {}", userId);
    }

    @Transactional
    public void suspendUser(UUID userId) {
        log.info("Suspending user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        user.suspend();
        userRepository.save(user);

        log.info("User suspended successfully: {}", userId);
    }

    @Transactional
    public void deactivateUser(UUID userId) {
        log.info("Deactivating user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId.toString()));

        user.deactivate();
        userRepository.save(user);

        log.info("User deactivated successfully: {}", userId);
    }

    // ==================== Helper Methods ====================

    private void validateEmailNotExists(String email) {
        if (userRepository.existsByEmail(email)) {
            log.warn("Validation failed: email already exists: {}", email);
            throw new ValidationException("Un compte existe déjà avec cet email");
        }
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .userType(user.getUserType().name())
                .location(user.getLocation())
                .country(user.getCountry())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .donorProfile(convertDonorProfile(user.getDonorProfile()))
                .organizationProfile(convertOrganizationProfile(user.getOrganizationProfile()))
                .build();
    }

    private UserDTO.DonorProfileDTO convertDonorProfile(User.DonorProfile profile) {
        if (profile == null)
            return null;
        return UserDTO.DonorProfileDTO.builder()
                .donorType(profile.getDonorType())
                .totalDonations(profile.getTotalDonations())
                .campaignsSupported(profile.getCampaignsSupported())
                .preferredCategories(profile.getPreferredCategories())
                .build();
    }

    private UserDTO.OrganizationProfileDTO convertOrganizationProfile(User.OrganizationProfile profile) {
        if (profile == null)
            return null;
        return UserDTO.OrganizationProfileDTO.builder()
                .organizationName(profile.getOrganizationName())
                .organizationType(profile.getOrganizationType())
                .creationYear(profile.getCreationYear())
                .websiteUrl(profile.getWebsiteUrl())
                .address(profile.getAddress())
                .mission(profile.getMission())
                .sectors(profile.getSectors())
                .rccm(profile.getRccm())
                .taxId(profile.getTaxId())
                .legalDocUrl(profile.getLegalDocUrl())
                .statutesUrl(profile.getStatutesUrl())
                .minasAuthUrl(profile.getMinasAuthUrl())
                .assocReceiptUrl(profile.getAssocReceiptUrl())
                .rulesInternalUrl(profile.getRulesInternalUrl())
                .registryEntryUrl(profile.getRegistryEntryUrl())
                .socialInquiryUrl(profile.getSocialInquiryUrl())
                .socializeLinks(profile.getSocializeLinks())
                .representativeName(profile.getRepresentativeName())
                .representativeContact(profile.getRepresentativeContact())
                .build();
    }

    private static String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[12];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes).replaceAll("[^a-zA-Z0-9]", "").substring(0, 12);
    }
}
