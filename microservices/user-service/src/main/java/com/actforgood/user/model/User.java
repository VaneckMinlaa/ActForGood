package com.actforgood.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private UserType userType; // DONOR, NGO, ORPHANAGE, ASSOCIATION
    private String location;
    private String country;
    private UserStatus status; // ACTIVE, INACTIVE, SUSPENDED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Donor specific fields
    private DonorProfile donorProfile;
    
    // NGO/Orphanage/Association specific fields
    private OrganizationProfile organizationProfile;
    
    public enum UserType {
        DONOR, NGO, ORPHANAGE, ASSOCIATION
    }
    
    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
