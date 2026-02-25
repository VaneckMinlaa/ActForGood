package com.actforgood.user.repository;

import com.actforgood.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Pagination support
    Page<User> findByUserType(User.UserType userType, Pageable pageable);
    Page<User> findByStatus(User.UserStatus status, Pageable pageable);

    // Custom queries
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE' AND u.userType = :userType")
    Page<User> findActiveUsersByType(@Param("userType") User.UserType userType, Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchByName(@Param("searchTerm") String searchTerm, Pageable pageable);

    List<User> findByStatus(User.UserStatus status);
    List<User> findByUserType(User.UserType userType);
}
