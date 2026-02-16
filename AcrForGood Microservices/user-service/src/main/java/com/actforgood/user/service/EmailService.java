package com.actforgood.user.service;

/**
 * Envoi du mot de passe par email après validation admin.
 * Implémentation actuelle : log en console. À remplacer par SMTP (Spring Mail) en production.
 */
public interface EmailService {
    void sendPasswordByEmail(String toEmail, String firstName, String temporaryPassword);
}
