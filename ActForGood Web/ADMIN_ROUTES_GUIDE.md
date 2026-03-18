# Guide des Routes Admin - ActForGood

## Configuration des Routes

### Routes Principales

| Route | Description | Protection | Rôle requis |
|-------|-------------|------------|-------------|
| `/admin` | Dashboard administrateur | AuthGuard + RoleGuard | ADMIN |
| `/admin/donors` | Gestion des donateurs | AuthGuard + RoleGuard | ADMIN |
| `/admin/companies` | Gestion des entreprises | AuthGuard + RoleGuard | ADMIN |
| `/admin/funds` | Gestion des fonds et dons | AuthGuard + RoleGuard | ADMIN |
| `/admin/ngos` | Gestion des ONGs | AuthGuard + RoleGuard | ADMIN |
| `/admin/orphanages` | Gestion des orphelinats | AuthGuard + RoleGuard | ADMIN |
| `/admin/reports` | Rapports et statistiques | AuthGuard + RoleGuard | ADMIN |
| `/admin/settings` | Paramètres admin | AuthGuard + RoleGuard | ADMIN |

## Système de Redirection

### Après connexion
L'utilisateur est automatiquement redirigé selon son rôle :

- **ADMIN** → `/admin` (Dashboard administrateur)
- **ORGANIZATION** → `/dashboard` (Dashboard organisation)
- **DONOR** → `/` (Page d'accueil)

### Protection des routes
1. **AuthGuard** : Vérifie si l'utilisateur est connecté
2. **RoleGuard** : Vérifie si l'utilisateur a le rôle requis

Si l'utilisateur n'a pas le bon rôle, il est redirigé vers sa page appropriée.

## Test des Routes

### 1. Tester l'accès admin

```typescript
// Dans le localStorage, simuler un utilisateur admin
localStorage.setItem('token', 'fake-token-123');
localStorage.setItem('user', JSON.stringify({
  token: 'fake-token-123',
  userId: '1',
  email: 'admin@actforgood.com',
  userType: 'ADMIN',
  expiresIn: 3600
}));
```

Puis naviguer vers : `http://localhost:4200/admin`

### 2. Tester la redirection par rôle

**Utilisateur DONOR :**
```typescript
localStorage.setItem('user', JSON.stringify({
  token: 'fake-token-123',
  userId: '2',
  email: 'donor@example.com',
  userType: 'DONOR',
  expiresIn: 3600
}));
```
Essayer d'accéder à `/admin` → Redirigé vers `/`

**Utilisateur ORGANIZATION :**
```typescript
localStorage.setItem('user', JSON.stringify({
  token: 'fake-token-123',
  userId: '3',
  email: 'org@example.com',
  userType: 'ORGANIZATION',
  expiresIn: 3600
}));
```
Essayer d'accéder à `/admin` → Redirigé vers `/dashboard`

### 3. Tester sans authentification

```typescript
localStorage.clear();
```
Essayer d'accéder à `/admin` → Redirigé vers `/auth/login`

## Fonctionnalités Implémentées

✅ Dashboard admin avec sidebar complète
✅ Navigation entre tous les modules admin
✅ Protection par rôle (RoleGuard)
✅ Redirection automatique après login selon le rôle
✅ Bouton de déconnexion fonctionnel
✅ Sidebar responsive (collapse sur mobile)
✅ Thème cohérent avec ActForGood (#e89b2c)

## Prochaines Étapes

1. Implémenter les vues pour chaque module admin
2. Créer les services pour les opérations CRUD
3. Ajouter la gestion des permissions granulaires
4. Implémenter les formulaires de création/édition
5. Ajouter les tableaux de données avec pagination
6. Créer les graphiques et statistiques avancées

## Structure des Fichiers

```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts          ✅ Vérifie l'authentification
│   │   └── role.guard.ts          ✅ Vérifie le rôle
│   ├── models/
│   │   └── user-role.enum.ts      ✅ Énumération des rôles
│   └── services/
│       └── auth.service.ts        ✅ Gestion auth + redirections
├── features/
│   └── admin/
│       ├── admin.module.ts        ✅ Module admin
│       ├── admin-routing.module.ts ✅ Routes admin
│       └── components/
│           ├── dashboard/         ✅ Dashboard principal
│           ├── manage-donors/     🔲 À implémenter
│           ├── manage-companies/  🔲 À implémenter
│           ├── manage-funds/      🔲 À implémenter
│           ├── manage-ngos/       🔲 À implémenter
│           ├── manage-orphanages/ 🔲 À implémenter
│           ├── reports/           🔲 À implémenter
│           └── settings/          🔲 À implémenter
└── app-routing.module.ts          ✅ Routes principales
```

## Notes Importantes

- Le backend doit retourner le champ `userType` dans la réponse d'authentification
- Les tokens JWT doivent être valides et contenir les informations de rôle
- La sidebar admin est indépendante du MainLayout (pas de double header)
- Tous les composants admin sont standalone pour plus de flexibilité
