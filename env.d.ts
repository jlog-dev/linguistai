interface ImportMetaEnv {
  readonly VITE_QWEN_API_KEY: string;
  readonly VITE_MINIMAX_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}