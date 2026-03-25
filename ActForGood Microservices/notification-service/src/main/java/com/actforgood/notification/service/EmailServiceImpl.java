package com.actforgood.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendApprovalEmail(String toEmail, String firstName, String temporaryPassword) {
        String htmlStructure = 
            "\n------------------------------------------------------------\n" +
            "Sujet : Bienvenue sur ActForGood - Votre compte a été validé\n" +
            "------------------------------------------------------------\n" +
            "Bonjour " + (firstName != null ? firstName : "Partenaire") + ",\n\n" +
            "Nous avons le plaisir de vous informer que votre demande de création de compte sur ActForGood a été approuvée après vérification de vos documents.\n\n" +
            "Voici vos identifiants de connexion :\n" +
            "- Email : " + toEmail + "\n" +
            "- Mot de passe temporaire : " + temporaryPassword + "\n\n" +
            "Pour votre sécurité, nous vous recommandons de changer votre mot de passe dès votre première connexion.\n\n" +
            "Lien de connexion : http://localhost:4200/auth/login\n\n" +
            "L'Équipe ActForGood\n" +
            "------------------------------------------------------------\n";
        
        log.info(htmlStructure);
    }

    @Override
    public void sendRejectionEmail(String toEmail, String firstName, String reason) {
        String htmlStructure = 
            "\n------------------------------------------------------------\n" +
            "Sujet : Information concernant votre demande ActForGood\n" +
            "------------------------------------------------------------\n" +
            "Bonjour " + (firstName != null ? firstName : "Partenaire") + ",\n\n" +
            "Nous avons bien reçu votre demande d'inscription sur ActForGood. Après examen de votre dossier, nous ne sommes malheureusement pas en mesure de valider votre compte pour la raison suivante :\n\n" +
            "> " + reason + "\n\n" +
            "Si vous souhaitez apporter des corrections ou des documents complémentaires, n'hésitez pas à nous contacter ou à soumettre une nouvelle demande.\n\n" +
            "Cordialement,\n" +
            "L'Équipe de Modération ActForGood\n" +
            "------------------------------------------------------------\n";
        
        log.info(htmlStructure);
    }
}
