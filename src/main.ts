import { TelegramAuth, TelegramUser } from './telegram-auth';

const clientId = import.meta.env.VITE_TELEGRAM_CLIENT_ID;
const clientSecret = import.meta.env.VITE_TELEGRAM_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_TELEGRAM_REDIRECT_URI;

const auth = new TelegramAuth(clientId, clientSecret, redirectUri);

const loadingEl = document.getElementById('loading') as HTMLDivElement;
const errorEl = document.getElementById('error') as HTMLDivElement;
const loginSection = document.getElementById('loginSection') as HTMLDivElement;
const profileSection = document.getElementById('profileSection') as HTMLDivElement;
const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const avatarEl = document.getElementById('avatar') as HTMLImageElement;
const nameEl = document.getElementById('name') as HTMLHeadingElement;
const usernameEl = document.getElementById('username') as HTMLParagraphElement;
const phoneEl = document.getElementById('phone') as HTMLParagraphElement;

function showLoading(show: boolean): void {
  loadingEl.classList.toggle('hidden', !show);
}

function showError(message: string): void {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

function hideError(): void {
  errorEl.classList.add('hidden');
}

function displayProfile(user: TelegramUser): void {
  loginSection.classList.add('hidden');
  profileSection.classList.remove('hidden');

  if (user.picture) {
    avatarEl.src = user.picture;
  }
  nameEl.textContent = user.name || 'No name';
  usernameEl.textContent = user.preferred_username 
    ? `@${user.preferred_username}` 
    : 'No username';
  phoneEl.textContent = user.phone_number || '';
}

function handleLogout(): void {
  loginSection.classList.remove('hidden');
  profileSection.classList.add('hidden');
  window.history.replaceState({}, document.title, redirectUri);
  avatarEl.src = '';
  nameEl.textContent = '';
  usernameEl.textContent = '';
  phoneEl.textContent = '';
  hideError();
}

async function handleCallback(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  if (error) {
    showError(`Authorization error: ${error}`);
    window.history.replaceState({}, document.title, redirectUri);
    return;
  }

  if (!code || !state) {
    return;
  }

  const savedState = localStorage.getItem('telegram_oauth_state');
  if (state !== savedState) {
    showError('Invalid state parameter. Possible CSRF attack.');
    window.history.replaceState({}, document.title, redirectUri);
    return;
  }

  showLoading(true);
  hideError();

  try {
    const tokenResponse = await auth.exchangeCodeForToken(code);
    const user = auth.decodeIdToken(tokenResponse.id_token);
    window.history.replaceState({}, document.title, redirectUri);
    displayProfile(user);
  } catch (err) {
    showError(err instanceof Error ? err.message : 'Authentication failed');
    window.history.replaceState({}, document.title, redirectUri);
  } finally {
    showLoading(false);
  }
}

loginBtn.addEventListener('click', async () => {
  hideError();
  const authUrl = await auth.getAuthorizationUrl();
  window.location.href = authUrl;
});

logoutBtn.addEventListener('click', handleLogout);

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('code')) {
  handleCallback();
}