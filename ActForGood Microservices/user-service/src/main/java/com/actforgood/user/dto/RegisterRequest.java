package com.actforgood.user.dto;

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
}
