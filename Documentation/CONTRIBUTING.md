# Contributing to ActForGood

First off, thank you for considering contributing to ActForGood! It's people like you that make the platform such a great solution for supporting charitable causes in Cameroon.

## Code of Conduct

There is a Code of Conduct. Please follow it in all your interactions with the project. We are committed to providing a welcoming and inspiring community for all.

## What This Platform Is About

ActForGood is a mobile and web platform that enables:
- **Donors** to discover and support charitable campaigns
- **Organizations (ONGs)** to create campaigns and receive verified donations
- **Administrators** to validate organizations and oversee the platform
- **Transparency** through blockchain-based traceability

We build with integrity, security, and accessibility as core values.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the styleguides
* Include appropriate test cases
* End all files with a newline
* Avoid platform-dependent code

## Development Setup

### Getting Started
```bash
# 1. Clone the repository
git clone https://github.com/your-org/actforgood.git
cd actforgood

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Setup development environment
make install

# 4. Start services
make start

# 5. Start developing!
```

### Prerequisites
- Node.js v18+
- Java 21
- Maven 3.8+
- Docker & Docker Compose
- Git

See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup instructions.

## Styleguides

### Git Commit Messages

* Use the present tense ("add feature" not "added feature")
* Use the imperative mood ("move cursor to..." not "moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Format:
```
type(scope): subject

body

footer(s)
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing or correcting existing tests
- `chore`: Changes to build process, dependencies, tooling

Examples:
```
feat(auth): add JWT token refresh mechanism

fix(payment): resolve race condition in payment processing

docs(readme): update installation instructions

chore(deps): upgrade Spring Boot to 3.2.1
```

### Java/Spring Boot Code Style

```java
// Follow Google Java Style Guide
// - 2-space indentation
// - 100 character line limit (soft)
// - Always use braces for control structures

// Class organization
public class UserService {
    // Fields first
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor
    @Autowired
    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.userRepository = repo;
        this.passwordEncoder = encoder;
    }

    // Public methods
    public User createUser(CreateUserRequest request) {
        validateEmail(request.getEmail());
        // ...
    }

    // Private methods
    private void validateEmail(String email) {
        // ...
    }
}

// Naming conventions
private final UserRepository userRepository;  // camelCase
private static final String CONFIG_KEY = "app.config";  // UPPER_CASE
class UserService { }  // PascalCase
void processPayment() { }  // camelCase
```

### TypeScript/Angular Code Style

```typescript
// Follow Angular Style Guide

// Component example
@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss']
})
export class CampaignCardComponent implements OnInit {
  @Input() campaign: Campaign;
  @Output() donateClick = new EventEmitter<Campaign>();

  constructor(private logger: LoggerService) {}

  ngOnInit() {
    this.loadCampaignDetails();
  }

  onDonate() {
    this.donateClick.emit(this.campaign);
  }
}

// Service example
@Injectable({ providedIn: 'root' })
export class CampaignService {
  private apiUrl = '/api/campaigns';

  constructor(private http: HttpClient) {}

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.apiUrl);
  }
}

// Naming conventions
export interface Campaign { }  // PascalCase
private campaigns$: Observable<Campaign[]>;  // camelCase with $ for observables
class CampaignService { }  // PascalCase
getCampaigns() { }  // camelCase
```

### React Native Code Style

```typescript
// Use functional components with hooks
interface CampaignCardProps {
  campaign: Campaign;
  onDonate: (campaign: Campaign) => void;
}

export const CampaignCard: FC<CampaignCardProps> = ({
  campaign,
  onDonate
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      await onDonate(campaign);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      {/* Component content */}
    </View>
  );
};
```

### Documentation Style

* Use Markdown
* 80 character line limit when possible
* Include code examples
* Use clear headings and sections
* Link to related documentation

## Testing

### Backend (Java)

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# With coverage
mvn clean test jacoco:report
```

Test structure:
```java
@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTest {

    @MockBean
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void shouldCreateUserSuccessfully() {
        // Arrange
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("test@example.com");

        // Act
        User result = userService.createUser(request);

        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }
}
```

### Mobile (React Native)

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

Test structure:
```typescript
describe('CampaignCard', () => {
  it('should render campaign details', () => {
    const campaign: Campaign = {
      id: '1',
      title: 'Test Campaign',
      target: 1000
    };

    const { getByText } = render(
      <CampaignCard campaign={campaign} onDonate={jest.fn()} />
    );

    expect(getByText('Test Campaign')).toBeInTheDocument();
  });
});
```

### Web (Angular)

```bash
# Run tests
npm test

# Headless (CI mode)
npm test -- --watch=false --browsers=Chrome

# Coverage
npm test -- --code-coverage
```

Test structure:
```typescript
describe('CampaignService', () => {
  let service: CampaignService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CampaignService]
    });
    service = TestBed.inject(CampaignService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch campaigns', () => {
    service.getCampaigns().subscribe(campaigns => {
      expect(campaigns.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/campaigns');
    expect(req.request.method).toBe('GET');
    req.flush([/* mock data */]);
  });
});
```

## Architecture Guidelines

Follow the patterns documented in [ARCHITECTURE_COMPLETE.md](./documentation/ARCHITECTURE_COMPLETE.md):

### Backend Architecture
- **Controller/API**: HTTP endpoints with validation
- **Service**: Business logic and orchestration
- **Repository**: Data persistence with Spring Data
- **Entity**: JPA entities with proper annotations
- **DTO**: Data transfer between layers
- **Exception**: Custom exceptions for error handling
- **Config**: Spring configuration and beans

Principle: **Unidirectional dependencies flow upward** (Controller → Service → Repository → Entity)

### Mobile Architecture
- **Presentation**: UI Components and Screens
- **ViewModel**: State management and logic
- **Repository**: Data abstraction
- **Service**: API and business logic
- **Models**: Data structures and types

### Web Architecture
- **Core Module**: Singleton services (Http, Auth, Logger)
- **Shared Module**: Reusable components and directives
- **Feature Modules**: Feature-specific components and services
- **Guards**: Route protection (AuthGuard, AdminGuard)
- **Interceptors**: HTTP request/response handling (JWT, error handling)

## Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Implement** your changes following the styleguides
4. **Add/update** tests for your changes
5. **Run tests** locally: `make test`
6. **Commit** with meaningful messages: `git commit -m "feat(module): description"`
7. **Push** to your fork: `git push origin feature/your-feature-name`
8. **Create** a Pull Request with:
   - Clear title and description
   - References to related issues
   - Screenshots/videos if UI changes
   - Test results
   - Checklist completion

### PR Checklist
- [ ] Tests pass locally (`make test`)
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Commits are meaningful
- [ ] No secrets or credentials in code

## Review Process

**All pull requests must:**
- Pass automated CI/CD checks
- Be reviewed by at least 1 maintainer
- Have no merge conflicts
- Include appropriate tests

**Maintainers may request:**
- Code changes
- Additional tests
- Documentation updates
- Style corrections

## Issues and Feature Requests

### Issue Labels
- `bug`: Something is broken
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Need community input
- `question`: Question or discussion
- `priority-high`: Urgent/critical
- `backend`: Backend/microservices
- `mobile`: React Native mobile app
- `web`: Angular web dashboard

## Release Process

1. Update version numbers in `pom.xml` and `package.json`
2. Update CHANGELOG.md
3. Create GitHub release with notes
4. Docker images are built automatically
5. Deployment happens via CI/CD pipeline

## Need Help?

* **Documentation**: [ARCHITECTURE_COMPLETE.md](./documentation/ARCHITECTURE_COMPLETE.md)
* **Setup Issues**: [GETTING_STARTED.md](./GETTING_STARTED.md)
* **Architecture Questions**: [ARCHITECTURE_COMPLETE.md](./documentation/ARCHITECTURE_COMPLETE.md)
* **Slack Channel**: #actforgood-dev
* **Email**: dev-team@actforgood.org

## Additional Notes

### Performance Considerations
- Backend: Use pagination for large datasets, implement caching with Redis
- Mobile: Optimize images, implement lazy loading, use memoization
- Web: Use OnPush change detection, lazy load feature modules, optimize bundles

### Security
- Never commit secrets or credentials
- Use environment variables for sensitive data
- Validate and sanitize all inputs
- Follow OWASP guidelines
- Use HTTPS in production

### Accessibility
- Follow WCAG 2.1 level AA guidelines
- Test with screen readers
- Use semantic HTML/components
- Ensure proper color contrast
- Keyboard navigation support

## Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Release notes
- Project website

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ActForGood! Together, we're making a difference in Cameroon. 🌟
