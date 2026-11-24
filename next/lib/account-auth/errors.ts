// SDK failures can be returned or thrown; thrown failures retain the upstream code.
export function authErrorCode(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const error = value as { code?: unknown; error?: { code?: unknown } };
  const code = error.error?.code ?? error.code;
  return typeof code === 'string' ? code.toUpperCase() : '';
}

export function authErrorMessage(value: unknown) {
  switch (authErrorCode(value)) {
    case 'INVALID_EMAIL_OR_PASSWORD':
    case 'INVALID_CREDENTIALS':
      return 'Adresse email ou mot de passe incorrect.';
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
    case 'EMAIL_EXISTS':
      return 'Cette adresse possède déjà un compte. Connectez-vous.';
    case 'INVALID_EMAIL':
    case 'EMAIL_ADDRESS_INVALID':
      return 'Vérifiez votre adresse email.';
    case 'PASSWORD_TOO_SHORT':
    case 'WEAK_PASSWORD':
      return 'Choisissez un mot de passe d’au moins 8 caractères.';
    case 'PASSWORD_TOO_LONG':
      return 'Le mot de passe ne doit pas dépasser 128 caractères.';
    case 'TOO_MANY_REQUESTS':
    case 'OVER_REQUEST_RATE_LIMIT':
      return 'Trop de tentatives. Réessayez dans quelques minutes.';
    case 'INVALID_OTP':
    case 'OTP_EXPIRED':
      return 'Code invalide ou expiré. Demandez un nouveau code.';
    default:
      return 'Connexion impossible. Vérifiez votre connexion et réessayez.';
  }
}
