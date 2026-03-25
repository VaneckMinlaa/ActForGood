package com.actforgood.user.config;

import com.actforgood.user.model.User;
import com.actforgood.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

/**
 * Initialiseur de données de test au lancement du service User.
 */
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Créer un utilisateur ADMIN
                User admin = new User();
                admin.setEmail("admin@actforgood.com");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setFirstName("Admin");
                admin.setLastName("ActForGood");
                admin.setUserType(User.UserType.PARTNER); // Role de confiance
                admin.setStatus(User.UserStatus.ACTIVE);
                userRepository.save(admin);

                // Créer une Équipe/ORPHELINAT (NGO/ORPHANAGE)
                User org = new User();
                org.setEmail("org@actforgood.com");
                org.setPassword(passwordEncoder.encode("org"));
                org.setFirstName("Orphelinat");
                org.setLastName("Sainte Maria");
                org.setUserType(User.UserType.ORPHANAGE);
                org.setStatus(User.UserStatus.ACTIVE);
                userRepository.save(org);

                // Créer un DONATEUR (DONOR)
                User donor = new User();
                donor.setEmail("donor@actforgood.com");
                donor.setPassword(passwordEncoder.encode("donor"));
                donor.setFirstName("Donateur");
                donor.setLastName("Généreux");
                donor.setUserType(User.UserType.DONOR);
                donor.setStatus(User.UserStatus.ACTIVE);
                userRepository.save(donor);

                System.out.println("ActForGood >> Données de test (comptes utilisateurs) insérées avec succès.");
            }
        };
    }
}
