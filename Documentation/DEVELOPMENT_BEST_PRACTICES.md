# Development Best Practices

This document outlines the coding standards, architectural patterns, and development practices for the ActForGood project.

## Table of Contents

1. [Code Quality](#code-quality)
2. [Architecture Patterns](#architecture-patterns)
3. [Database Design](#database-design)
4. [API Design](#api-design)
5. [Error Handling](#error-handling)
6. [Logging & Monitoring](#logging--monitoring)
7. [Performance](#performance)
8. [Security](#security)
9. [Testing](#testing)
10. [DevOps](#devops)

## Code Quality

### Static Analysis

```bash
# Java: SonarQube
mvn sonar:sonar -Dsonar.projectKey=actforgood \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://sonarqube:9000

# TypeScript: ESLint
cd ActForGood\ Web
npm run lint -- --fix

# TypeScript: Type checking
tsc --noEmit

# Code formatting: Prettier
npm run format
```

### SonarQube Quality Gates

```yaml
# Quality profile for Java
Blocker Issues: 0
Critical Issues: 0
Major Issues: <5
Code Coverage: >80%
Duplicated Lines: <3%
Tech Debt Ratio: <5%
```

### Code Review Checklist

Before submitting a PR, verify:

- [ ] Code follows project style guidelines
- [ ] No logging of sensitive data (PII, passwords, tokens)
- [ ] Error messages are meaningful and user-friendly
- [ ] No hardcoded values (use environment variables)
- [ ] Proper exception handling with specific exception types
- [ ] No N+1 query problems
- [ ] Database migrations use proper versioning
- [ ] Input validation and sanitization
- [ ] Comments explain WHY, not WHAT
- [ ] Tests cover happy path and edge cases

## Architecture Patterns

### Backend: Spring Boot Clean Architecture

```
api-gateway/
├── src/main/java/com/actforgood/api/
│   ├── controller/          # REST endpoints
│   │   └── CampaignController.java
│   ├── service/             # Business logic
│   │   └── CampaignService.java
│   │   └── CampaignServiceImpl.java
│   ├── repository/          # Data access
│   │   └── CampaignRepository.java
│   ├── entity/              # JPA entities
│   │   └── Campaign.java
│   ├── dto/                 # Data transfer objects
│   │   ├── CampaignCreateDTO.java
│   │   └── CampaignResponseDTO.java
│   ├── exception/           # Custom exceptions
│   │   ├── ResourceNotFoundException.java
│   │   └── ValidationException.java
│   ├── config/              # Spring configuration
│   │   └── SecurityConfig.java
│   ├── util/                # Utility classes
│   │   └── DateUtil.java
│   ├── mapper/              # DTO mapping
│   │   └── CampaignMapper.java
│   └── ApiGatewayApplication.java
└── src/test/java/          # Unit & integration tests
```

### Dependency Flow (Unidirectional)

```
Controller → Service → Repository → Entity
    ↓         ↑         ↑
    └─────→ DTO ────────┘
    ↓
Exception
```

**Rules:**
- Controller calls Service only
- Service calls Repository and other Services
- Repository calls Entity only
- Never call Controller from Service or Repository
- Use DTOs to decouple layers
- Exceptions flow upward

### Service Layer Pattern

```java
public interface CampaignService {
    Campaign getCampaignById(UUID id);
    Page<Campaign> getAllCampaigns(Pageable pageable);
    Campaign createCampaign(CreateCampaignRequest request);
    Campaign updateCampaign(UUID id, UpdateCampaignRequest request);
    void deleteCampaign(UUID id);
}

@Service
@Transactional
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignMapper mapper;
    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public CampaignServiceImpl(
        CampaignRepository campaignRepository,
        CampaignMapper mapper,
        ApplicationEventPublisher eventPublisher
    ) {
        this.campaignRepository = campaignRepository;
        this.mapper = mapper;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public Campaign getCampaignById(UUID id) {
        return campaignRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Campaign not found: " + id
            ));
    }

    @Override
    @Transactional
    public Campaign createCampaign(CreateCampaignRequest request) {
        validateRequest(request);

        Campaign campaign = mapper.toCampaign(request);
        campaign = campaignRepository.save(campaign);

        // Publish event for async processing
        eventPublisher.publishEvent(new CampaignCreatedEvent(campaign));

        return campaign;
    }

    private void validateRequest(CreateCampaignRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ValidationException("Campaign title is required");
        }
        // More validation
    }
}
```

### Repository Pattern with Spring Data

```java
@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {

    // Derived query method
    Page<Campaign> findByStatusAndCreatedAtGreaterThan(
        CampaignStatus status,
        LocalDateTime createdAt,
        Pageable pageable
    );

    // Custom query
    @Query("SELECT c FROM Campaign c WHERE c.status = :status")
    List<Campaign> findActiveCampaigns(@Param("status") CampaignStatus status);

    // With fetch join to avoid N+1
    @Query("SELECT DISTINCT c FROM Campaign c " +
           "LEFT JOIN FETCH c.donations " +
           "WHERE c.id = :id")
    Optional<Campaign> findByIdWithDonations(@Param("id") UUID id);
}
```

### Mapper Pattern

```java
@Component
public class CampaignMapper {

    public CampaignResponseDTO toCampaignDTO(Campaign campaign) {
        return CampaignResponseDTO.builder()
            .id(campaign.getId())
            .title(campaign.getTitle())
            .description(campaign.getDescription())
            .targetAmount(campaign.getTargetAmount())
            .collectedAmount(campaign.getTotalDonations())
            .status(campaign.getStatus())
            .createdAt(campaign.getCreatedAt())
            .build();
    }

    public Campaign toCampaign(CreateCampaignRequest request) {
        return Campaign.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .targetAmount(request.getTargetAmount())
            .status(CampaignStatus.PENDING)
            .build();
    }
}
```

## Database Design

### Entity Design

```java
@Entity
@Table(name = "campaigns", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_ong_id", columnList = "ong_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal collectedAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ong_id", nullable = false)
    private Organization organization;

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Donation> donations = new LinkedHashSet<>();

    @Column(name = "starts_at")
    private LocalDateTime startDate;

    @Column(name = "ends_at")
    private LocalDateTime endDate;

    public BigDecimal getProgressPercentage() {
        if (targetAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return collectedAmount.divide(targetAmount, 2, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100));
    }
}
```

### BaseEntity with Audit Columns

```java
@MappedSuperclass
@Data
@NoArgsConstructor
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Version
    @Column(name = "version")
    private Long version;
}
```

### Query Performance

```java
// ❌ BAD: N+1 query problem
@Transactional(readOnly = true)
public List<CampaignDTO> getAllCampaigns() {
    List<Campaign> campaigns = campaignRepository.findAll();
    // This causes N additional queries!
    return campaigns.stream()
        .map(c -> new CampaignDTO(c.getId(), c.getOrganization().getName()))
        .collect(toList());
}

// ✅ GOOD: Use fetch join
@Query("SELECT c FROM Campaign c " +
       "LEFT JOIN FETCH c.organization " +
       "LEFT JOIN FETCH c.donations")
List<Campaign> getAllCampaignsWithAssociations();

@Transactional(readOnly = true)
public Page<CampaignDTO> getAllCampaigns(Pageable pageable) {
    return campaignRepository.getAllCampaignsWithAssociations(pageable)
        .map(CampaignMapper::toDTO);
}
```

### Database Migrations with Flyway

```sql
-- V1__Create_campaigns_table.sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2) NOT NULL,
    collected_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    ong_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    FOREIGN KEY (ong_id) REFERENCES organizations(id) ON DELETE RESTRICT
);

CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX idx_campaigns_ong_id ON campaigns(ong_id);

-- V2__Add_date_columns_to_campaigns.sql
ALTER TABLE campaigns
ADD COLUMN starts_at TIMESTAMP,
ADD COLUMN ends_at TIMESTAMP;

CREATE INDEX idx_campaigns_date_range ON campaigns(starts_at, ends_at);
```

## API Design

### RESTful Conventions

```
GET    /api/campaigns              # List campaigns (with pagination, filtering)
GET    /api/campaigns/{id}         # Get campaign details
POST   /api/campaigns              # Create new campaign
PUT    /api/campaigns/{id}         # Update campaign fully
PATCH  /api/campaigns/{id}         # Update campaign partially
DELETE /api/campaigns/{id}         # Delete campaign

# Nested resources
GET    /api/campaigns/{id}/donations   # List campaign donations
POST   /api/campaigns/{id}/donations   # Add donation to campaign
```

### Response Format

```java
@RestController
@RequestMapping("/api/campaigns")
@Slf4j
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CampaignDTO>>> getAllCampaigns(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) CampaignStatus status
    ) {
        log.info("Fetching campaigns: page={}, size={}, status={}", page, size, status);

        Pageable pageable = PageRequest.of(page, size);
        Page<CampaignDTO> campaigns = campaignService.getAllCampaigns(pageable, status);

        return ResponseEntity.ok(ApiResponse.success(
            "Campaigns retrieved successfully",
            campaigns
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignDTO>> getCampaignById(
        @PathVariable UUID id
    ) {
        CampaignDTO campaign = campaignService.getCampaignById(id);
        return ResponseEntity.ok(ApiResponse.success(
            "Campaign retrieved successfully",
            campaign
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampaignDTO>> createCampaign(
        @Valid @RequestBody CreateCampaignRequest request
    ) {
        log.info("Creating campaign: {}", request.getTitle());

        CampaignDTO campaign = campaignService.createCampaign(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                "Campaign created successfully",
                campaign
            ));
    }
}
```

### ApiResponse DTO

```java
@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private String path;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now(), null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now(), null);
    }
}
```

### Pagination

```java
// Request parameters
@GetMapping
public Page<CampaignDTO> getCampaigns(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "createdAt,desc") String sort
) {
    Sort sortOrder = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page, size, sortOrder);
    return campaignService.getCampaigns(pageable);
}

// Response
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": { "empty": false, "sorted": true }
  },
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "numberOfElements": 20,
  "first": true,
  "last": false,
  "empty": false
}
```

### Filtering & Searching

```java
@GetMapping
public Page<CampaignDTO> searchCampaigns(
    @RequestParam(required = false) String query,
    @RequestParam(required = false) CampaignStatus status,
    @RequestParam(required = false) LocalDate dateFrom,
    @RequestParam(required = false) LocalDate dateTo,
    Pageable pageable
) {
    CampaignSearchCriteria criteria = CampaignSearchCriteria.builder()
        .query(query)
        .status(status)
        .dateFrom(dateFrom)
        .dateTo(dateTo)
        .build();

    return campaignService.searchCampaigns(criteria, pageable);
}

// Usage:
// GET /api/campaigns?query=education&status=ACTIVE&dateFrom=2024-01-01
```

## Error Handling

### Custom Exceptions

```java
public class ResourceNotFoundException extends RuntimeException {
    private final String resourceName;
    private final Object resourceId;

    public ResourceNotFoundException(String resourceName, Object resourceId) {
        super(String.format("%s not found: %s", resourceName, resourceId));
        this.resourceName = resourceName;
        this.resourceId = resourceId;
    }
}

public class ValidationException extends RuntimeException {
    private final Map<String, String> errors;

    public ValidationException(String message) {
        super(message);
        this.errors = new HashMap<>();
    }

    public ValidationException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }
}

public class InsufficientFundsException extends RuntimeException {
    private final BigDecimal required;
    private final BigDecimal available;

    public InsufficientFundsException(BigDecimal required, BigDecimal available) {
        super(String.format("Insufficient funds. Required: %s, Available: %s",
            required, available));
        this.required = required;
        this.available = available;
    }
}
```

### Exception Handler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(
        ResourceNotFoundException ex,
        HttpServletRequest request
    ) {
        log.warn("Resource not found: {}", ex.getMessage());

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(
        ValidationException ex,
        HttpServletRequest request
    ) {
        log.warn("Validation error: {}", ex.getMessage());

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleUnexpected(
        Exception ex,
        HttpServletRequest request
    ) {
        log.error("Unexpected error", ex);

        String traceId = UUID.randomUUID().toString();
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(
                "An error occurred. Reference ID: " + traceId
            ));
    }
}
```

## Logging & Monitoring

### Logging Best Practices

```java
@Service
@Slf4j
public class PaymentService {

    public Payment processPayment(PaymentRequest request) {
        log.info("Processing payment request: {} from user: {}",
            request.getTransactionId(), request.getUserId());

        try {
            validatePaymentAmount(request.getAmount());

            Payment payment = createPaymentEntity(request);
            payment = paymentRepository.save(payment);

            log.info("Payment processed successfully: {} for amount: {}",
                payment.getId(), payment.getAmount());

            return payment;

        } catch (PaymentException ex) {
            log.error("Payment processing failed for transaction: {}",
                request.getTransactionId(), ex);
            throw ex;
        }
    }

    private void validatePaymentAmount(BigDecimal amount) {
        // Never log sensitive data!
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            log.warn("Invalid payment amount: {}", amount);
            throw new ValidationException("Amount must be positive");
        }
    }
}
```

### Log Levels

```
TRACE: Most detailed, for tracing program execution
DEBUG: Diagnostic information, for development
INFO:  General informational messages (default)
WARN:  Warning messages for potentially harmful situations
ERROR: Error messages for error conditions
```

### Structured Logging with SLF4J

```java
// ❌ Old way
log.info("User " + userId + " processed payment of " + amount);

// ✅ New way (structured logging)
log.info("Payment processed",
    "userId", userId,
    "amount", amount,
    "status", paymentStatus
);

// Or with logback pattern
MDC.put("userId", userId);
MDC.put("transactionId", transactionId);
log.info("Processing transaction");
MDC.clear();
```

### Monitoring with Actuator

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info,threaddump
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true
  metrics:
    tags:
      application: ${spring.application.name}
      environment: ${spring.profiles.active}
    export:
      prometheus:
        enabled: true
```

## Performance

### Caching Strategy

```java
@Service
@Slf4j
public class CampaignService {

    // Cache campaigns for 1 hour
    @Cacheable(value = "campaigns", key = "#id",
               unless = "#result == null")
    public CampaignDTO getCampaignById(UUID id) {
        log.info("Fetching campaign {}", id);
        return campaignRepository.findById(id)
            .map(mapper::toDTO)
            .orElse(null);
    }

    // Invalidate cache on update
    @CacheEvict(value = "campaigns", key = "#id")
    public CampaignDTO updateCampaign(UUID id, UpdateRequest request) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign", id));

        // Update logic
        return mapper.toDTO(campaign);
    }

    // Clear all campaigns cache
    @CacheEvict(value = "campaigns", allEntries = true)
    public void refreshCache() {
        log.info("Refreshing campaigns cache");
    }
}
```

### Query Optimization

```java
// ❌ N+1 Problem
public List<CampaignDTO> getCampaignsWithDonations() {
    return campaignRepository.findAll().stream()
        .map(c -> new CampaignDTO(
            c.getId(),
            c.getDonations().size()  // Triggers query for each campaign!
        ))
        .collect(toList());
}

// ✅ Optimized with fetch join
@Query("SELECT DISTINCT c FROM Campaign c " +
       "LEFT JOIN FETCH c.donations d")
List<Campaign> getCampaignsWithDonations();

// ✅ Or use projection
@Query("SELECT new map(c.id as id, count(d) as donationCount) " +
       "FROM Campaign c LEFT JOIN c.donations d GROUP BY c.id")
List<Map<String, Object>> getCampaignDonationCounts();
```

### Database Indexing

```java
@Entity
@Table(name = "campaigns", indexes = {
    @Index(name = "idx_status_created", columnList = "status, created_at"), // Composite
    @Index(name = "idx_ong_id", columnList = "ong_id"),                     // Foreign key
    @Index(name = "idx_search", columnList = "title, description")           // Full text search
})
public class Campaign extends BaseEntity {
    // ...
}
```

### Connection Pooling

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20        # Max connections
      minimum-idle: 5              # Min idle connections
      connection-timeout: 20000    # 20 seconds
      idle-timeout: 300000         # 5 minutes
      max-lifetime: 1200000        # 20 minutes
      auto-commit: true
      connection-test-query: "SELECT 1"
```

## Security

### Input Validation

```java
@Data
@Valid
public class CreateCampaignRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be 5-255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000, message = "Description must be 10-5000 characters")
    private String description;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    @DecimalMax(value = "999999.99", message = "Amount is too large")
    private BigDecimal targetAmount;

    @NotNull(message = "Organization is required")
    private UUID organizationId;

    @Email(message = "Contact email is invalid")
    private String contactEmail;
}

// Usage in controller
@PostMapping
public ResponseEntity<?> createCampaign(
    @Valid @RequestBody CreateCampaignRequest request
) {
    // Request is already validated
    return ResponseEntity.ok(campaignService.createCampaign(request));
}
```

### SQL Injection Prevention

```java
// ❌ VULNERABLE
String query = "SELECT * FROM campaigns WHERE title = '" + userInput + "'";
List<Campaign> campaigns = entityManager.createNativeQuery(query, Campaign.class)
    .getResultList();

// ✅ SAFE with parameterized query
@Query("SELECT c FROM Campaign c WHERE c.title = :title")
List<Campaign> findByTitle(@Param("title") String title);

// ✅ SAFE with Spring Data JpaRepository
Page<Campaign> findByTitleContainingAndStatus(String title, Status status, Pageable page);
```

### JWT Authentication

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/auth/login", "/api/auth/register").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
            .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class)
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

### CORS Configuration

```java
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                    .addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:3000",  // Mobile
                        "http://localhost:4200",  // Web
                        "https://app.actforgood.org"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("Content-Type", "Authorization")
                    .exposedHeaders("X-Total-Count", "X-Page-Number")
                    .maxAge(3600)
                    .allowCredentials(true);
            }
        };
    }
}
```

## Testing

### Unit Testing

```java
@SpringBootTest
@ActiveProfiles("test")
public class CampaignServiceTest {

    @MockBean
    private CampaignRepository campaignRepository;

    @Autowired
    private CampaignService campaignService;

    @Test
    @DisplayName("Should get campaign by id successfully")
    public void testGetCampaignById_Success() {
        // Arrange
        UUID campaignId = UUID.randomUUID();
        Campaign campaign = new Campaign();
        campaign.setId(campaignId);
        campaign.setTitle("Test Campaign");

        when(campaignRepository.findById(campaignId))
            .thenReturn(Optional.of(campaign));

        // Act
        Campaign result = campaignService.getCampaignById(campaignId);

        // Assert
        assertNotNull(result);
        assertEquals("Test Campaign", result.getTitle());
        verify(campaignRepository, times(1)).findById(campaignId);
    }

    @Test
    @DisplayName("Should throw exception when campaign not found")
    public void testGetCampaignById_NotFound() {
        // Arrange
        UUID campaignId = UUID.randomUUID();
        when(campaignRepository.findById(campaignId))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
            () -> campaignService.getCampaignById(campaignId));
    }
}
```

### Integration Testing with TestContainers

```java
@SpringBootTest
@Testcontainers
public class CampaignRepositoryIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("actforgood_test")
        .withUsername("postgres")
        .withPassword("test");

    @DynamicPropertySource
    static void postgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @Transactional
    public void testFindByStatus() {
        // Arrange
        Campaign campaign = new Campaign();
        campaign.setTitle("Test");
        campaign.setStatus(CampaignStatus.ACTIVE);
        campaignRepository.save(campaign);
        entityManager.flush();

        // Act
        List<Campaign> results = campaignRepository
            .findByStatus(CampaignStatus.ACTIVE);

        // Assert
        assertEquals(1, results.size());
    }
}
```

## DevOps

### Health Checks

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health
  endpoint:
    health:
      show-details: when-authorized
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
```

```java
@Component
public class CustomHealthIndicator extends AbstractHealthIndicator {

    @Autowired
    private CampaignRepository campaignRepository;

    @Override
    protected void doHealthCheck(Health.Builder builder) {
        try {
            long count = campaignRepository.count();
            builder.up()
                .withDetail("campaigns", count);
        } catch (Exception ex) {
            builder.down()
                .withException(ex);
        }
    }
}
```

### Metrics and Tracing

```java
@Service
@Slf4j
public class CampaignService {

    private final MeterRegistry meterRegistry;

    @Autowired
    public CampaignService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    public Campaign createCampaign(CreateCampaignRequest request) {
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            Campaign campaign = new Campaign();
            campaign.setTitle(request.getTitle());

            sample.stop(Timer.builder("campaign.creation.time")
                .description("Time to create a campaign")
                .publishPercentiles(0.95, 0.99)
                .register(meterRegistry));

            meterRegistry.counter("campaigns.created").increment();

            return campaign;
        } catch (Exception ex) {
            meterRegistry.counter("campaigns.creation.errors").increment();
            throw ex;
        }
    }
}
```

---

This document is living; update it as project standards evolve!
