/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend base URL (no trailing slash). Example: https://api.finallyon.onrender.com */
  readonly VITE_API_URL?: string;
  /** Public site URL for this frontend. Example: https://finallyon.vercel.app */
  readonly VITE_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
