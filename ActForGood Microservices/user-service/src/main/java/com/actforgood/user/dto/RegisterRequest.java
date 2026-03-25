package com.actforgood.user.dto;

import java.util.List;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Inscription : le mot de passe n'est pas fourni par l'utilisateur.
 * Il sera envoyé par email après validation par l'administrateur.
 */
@Data
public class RegisterRequest {
    @NotBlank
    @Email
    private String email;

    /** Optionnel en inscription : défini par l'admin et envoyé par mail */
    private String password;

    @NotBlank
    private String firstName;

    private String lastName;

    private String phone;

    @NotBlank
    private String userType;

    private String location;
    private String country;

    // Organization Information
    private String organizationName;
    private String organizationType;
    private Integer creationYear;
    private String website;
    private String address;
    private String mission;
    private java.util.List<String> sectors;

    // Legal Information & Documents (URLs or IDs after upload)
    private String rccm;
    private String taxId;
    private String legalDocUrl;
    private String statutesUrl;
    
    // Specific for Orphanages/NGOs (MINAS, etc.)
    private String minasAuthUrl;
    private String assocReceiptUrl;
    private String rulesInternalUrl;
    private String registryEntryUrl;
    private String socialInquiryUrl;
}
