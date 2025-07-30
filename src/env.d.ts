/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly YOUTUBE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}