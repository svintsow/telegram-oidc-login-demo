/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_CLIENT_ID: string
  readonly VITE_TELEGRAM_CLIENT_SECRET: string
  readonly VITE_TELEGRAM_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}