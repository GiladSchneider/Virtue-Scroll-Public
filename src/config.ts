const isDevelopment = import.meta.env.DEV;

export const config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:8787'
    : 'https://virtue-scroll-api.schneider-gilad.workers.dev'
};