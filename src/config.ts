interface EnvironmentConfig {
  API_URL: string;  
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    API_URL: 'http://localhost:8787',
  },
  production: {
    API_URL: 'https://api.virtuescroll.com',
  },
};

const getCurrentEnvironment = (): string => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'www.virtuescroll.com') {
      return 'production';
    }
  }
  return 'development';
};

export const config: EnvironmentConfig = environments[getCurrentEnvironment()];