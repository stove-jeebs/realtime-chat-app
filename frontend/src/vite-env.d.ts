/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_OTHER_VAR: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
