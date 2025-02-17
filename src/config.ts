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
  // Check if we're running in production based on the URL
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'www.virtuescroll.com') {
      return 'production';
    }
  }
  return 'development';
};

export const config: EnvironmentConfig = environments[getCurrentEnvironment()];