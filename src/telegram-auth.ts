export interface TelegramUser {
  id: number;
  name?: string;
  preferred_username?: string;
  picture?: string;
  phone_number?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
}

export class TelegramAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  async getAuthorizationUrl(): Promise<string> {
    const state = this.generateRandomString(32);
    const codeVerifier = this.generateRandomString(64);
    
    // Ждём Promise от SHA-256
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    localStorage.setItem('telegram_oauth_state', state);
    localStorage.setItem('telegram_oauth_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid profile phone',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `https://oauth.telegram.org/auth?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const codeVerifier = localStorage.getItem('telegram_oauth_code_verifier');
    const state = localStorage.getItem('telegram_oauth_state');

    if (!codeVerifier || !state) {
      throw new Error('Missing PKCE parameters');
    }

    const authHeader = btoa(`${this.clientId}:${this.clientSecret}`);

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: codeVerifier,
    });

    const response = await fetch('https://oauth.telegram.org/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    this.clearStoredParams();
    return data;
  }

  decodeIdToken(idToken: string): TelegramUser {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = JSON.parse(atob(parts[1]));
    return {
      id: payload.id || payload.sub,
      name: payload.name,
      preferred_username: payload.preferred_username,
      picture: payload.picture,
      phone_number: payload.phone_number,
    };
  }

  clearStoredParams(): void {
    localStorage.removeItem('telegram_oauth_state');
    localStorage.removeItem('telegram_oauth_code_verifier');
  }

  private generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => 
      ('0' + byte.toString(16)).slice(-2)
    ).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(hash);
  }

  private base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}