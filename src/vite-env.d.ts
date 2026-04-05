interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_MONGO_URI: string
  readonly VITE_MONGO_DB_NAME: string
  readonly VITE_JWT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
