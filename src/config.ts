interface EnvironmentConfig {
  API_URL: string;  
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    API_URL: 'http://localhost:8787',
  },
  production: {
    API_URL: 'https://virtue-scroll-api.schneider-gilad.workers.dev',
  },
};

// Determine the current environment
const getCurrentEnvironment = (): string => {
  // Cloudflare Pages sets this environment variable automatically
  if (import.meta.env.PROD) {
    return 'production';
  }
  return 'development';
};

export const config: EnvironmentConfig = environments[getCurrentEnvironment()];