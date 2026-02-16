package com.actforgood.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Envoi du mot de passe par email. Pour l'instant on log le mot de passe (dev).
 * En production : configurer Spring Mail et envoyer un vrai email.
 */
@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Override
    public void sendPasswordByEmail(String toEmail, String firstName, String temporaryPassword) {
        log.info("=== EMAIL (simulé) === To: {} | Bonjour {}, votre mot de passe temporaire: {} | === FIN ===",
                toEmail, firstName != null ? firstName : "", temporaryPassword);
        // TODO: utiliser Spring Mail pour envoyer un vrai email
    }
}
