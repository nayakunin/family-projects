import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
    schema: './src/schema/index.ts',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL as string,
    },
    verbose: true,
    strict: true,
});
