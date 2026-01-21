# Authentification Discord - Guide d'utilisation

## Configuration

L'authentification Discord est configurée et prête à l'emploi avec les endpoints de l'API BeemoBot.

### Endpoints utilisés

- **Connexion** : `GET /auth/discord/redirect`
- **Callback** : `GET /auth/discord/callback`

### Flux d'authentification

1. L'utilisateur clique sur le bouton "Login" dans le Header
2. Redirection vers `/auth/discord/redirect` (API)
3. Discord demande l'autorisation à l'utilisateur
4. Redirection vers `/auth/discord/callback?token=beemo_xxxxx`
5. Le frontend récupère le token et redirige vers `/profil`

## Utilisation dans les composants

### Hook useAuth

```typescript
import { useAuth } from "@/hooks";

function MyComponent() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Se déconnecter</button>
      ) : (
        <button onClick={login}>Se connecter avec Discord</button>
      )}
    </div>
  );
}
```

### Accès direct au token

```typescript
import { getToken, setToken, removeToken } from "@/lib/store/token";

// Récupérer le token
const token = getToken();

// Sauvegarder un token
setToken("beemo_xxxxx");

// Supprimer le token
removeToken();
```

## Pages créées

### `/auth/callback`

Page de callback qui gère le retour de Discord OAuth :

- Récupère le token depuis l'URL
- Le sauvegarde dans localStorage
- Redirige vers `/profil` en cas de succès
- Affiche les erreurs et redirige vers `/` en cas d'échec

### Header

Le Header affiche maintenant :

- Bouton "Login" si non connecté
- Boutons "Profil" et "Déconnexion" si connecté

## Utiliser le token pour les requêtes API

```typescript
import { getToken } from "@/lib/store/token";

async function fetchProtectedData() {
  const token = getToken();

  const response = await fetch(`${API_URL}/protected-endpoint`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
```

## Variables d'environnement

Le système utilise automatiquement l'URL de l'API configurée dans `next.config.mjs` :

```javascript
env: {
  API_URL: "http://localhost:65397",
}
```

Ou via `.env.local` :

```bash
NEXT_PUBLIC_API_URL=http://localhost:65397
API_URL=http://localhost:65397
```

## Sécurité

- Le token est stocké dans `localStorage` sous la clé `"token"`
- Le token est préfixé par `beemo_` par l'API
- Toujours utiliser HTTPS en production
- Le token est automatiquement envoyé dans l'en-tête `Authorization: Bearer {token}`
