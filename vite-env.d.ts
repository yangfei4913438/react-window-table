/// <reference types="vite/client" />

interface ImportMetaEnv {
    // 自定义变量
    readonly VITE_CUSTOM_VAR: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}