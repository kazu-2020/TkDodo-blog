/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_IMAGE_BASE_URL: string
  readonly VITE_REACT_APP_API_MOCKING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
