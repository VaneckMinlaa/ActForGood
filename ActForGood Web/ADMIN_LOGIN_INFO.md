# Guide de Connexion Admin - ActForGood

## 🎯 Identifiants de test (Mode Développement)

### Administrateur
```
Email: admin@actforgood.com
Mot de passe: admin
Rôle: ADMIN
Redirection: /admin
```

### Organisation
```
Email: org@actforgood.com
Mot de passe: org
Rôle: ORGANIZATION
Redirection: /dashboard
```

### Donateur
```
Email: donor@actforgood.com
Mot de passe: donor
Rôle: DONOR
Redirection: /
```

---

## 🚀 Comment se connecter

### Méthode 1 : Formulaire de connexion normal

1. Va sur : **http://localhost:4200/auth/login**
2. Entre les identifiants ci-dessus
3. Clique sur "Se connecter"
4. Tu seras automatiquement redirigé selon ton rôle

### Méthode 2 : Connexion rapide (Interface dev)

1. Va sur : **http://localhost:4200/auth/dev-login**
2. Clique sur la carte du rôle souhaité
3. Connexion instantanée

---

## 🔧 Simulation manuelle (Console navigateur)

### Pour te connecter en tant qu'ADMIN

Ouvre la console (F12) et exécute :

```javascript
localStorage.setItem('token', 'fake-admin-token-123');
localStorage.setItem('user', JSON.stringify({
  token: 'fake-admin-token-123',
  userId: 'admin-001',
  email: 'admin@actforgood.com',
  userType: 'ADMIN',
  expiresIn: 3600
}));
window.location.href = '/admin';
```

### Pour te connecter en tant qu'ORGANIZATION

```javascript
localStorage.setItem('token', 'fake-org-token-123');
localStorage.setItem('user', JSON.stringify({
  token: 'fake-org-token-123',
  userId: 'org-001',
  email: 'org@actforgood.com',
  userType: 'ORGANIZATION',
  expiresIn: 3600
}));
window.location.href = '/dashboard';
```

### Pour te connecter en tant que DONOR

```javascript
localStorage.setItem('token', 'fake-donor-token-123');
localStorage.setItem('user', JSON.stringify({
  token: 'fake-donor-token-123',
  userId: 'donor-001',
  email: 'donor@actforgood.com',
  userType: 'DONOR',
  expiresIn: 3600
}));
window.location.href = '/';
```

---

## 📋 Vérifier ta connexion

Pour vérifier quel utilisateur est connecté, ouvre la console et tape :

```javascript
console.log(JSON.parse(localStorage.getItem('user')));
```

Pour te déconnecter :

```javascript
localStorage.clear();
window.location.href = '/';
```

---

## 🎯 Routes disponibles selon le rôle

### ADMIN (après connexion)
- `/admin` - Dashboard administrateur ✅
- `/admin/donors` - Gestion des donateurs
- `/admin/companies` - Gestion des entreprises
- `/admin/funds` - Gestion des fonds
- `/admin/ngos` - Gestion des ONGs
- `/admin/orphanages` - Gestion des orphelinats
- `/admin/reports` - Rapports
- `/admin/settings` - Paramètres

### ORGANIZATION
- `/dashboard` - Dashboard organisation
- `/profile` - Profil

### DONOR
- `/` - Page d'accueil
- `/campaigns` - Liste des campagnes
- `/profile` - Profil

---

## ⚠️ Important

- Le mode dev avec identifiants en dur doit être **désactivé en production**
- Les tokens simulés ne sont pas sécurisés
- En production, utilise uniquement l'authentification via le backend
- Les guards vérifient le rôle stocké dans le localStorage

---

## 🛠️ Pour désactiver le mode dev en production

Dans `login.component.ts`, supprime ou commente le tableau `devUsers` et la logique de vérification locale.

---

## ✅ Fonctionnalités implémentées

- ✅ Connexion avec identifiants de test (sans backend)
- ✅ Redirection automatique selon le rôle
- ✅ Interface de connexion rapide (/auth/dev-login)
- ✅ Messages d'erreur si identifiants incorrects
- ✅ État de chargement pendant la connexion
- ✅ Protection des routes par rôle
- ✅ Dashboard admin complet avec sidebar
