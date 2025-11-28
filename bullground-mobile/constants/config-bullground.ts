const getApiUrl = (): string => {
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (envApiUrl) {
    console.log('[Config] Using API URL from .env:', envApiUrl);
    return envApiUrl;
  }

  if (__DEV__) {
    console.log('[Config] Using default iOS Simulator URL: http://localhost:3000');
    return 'http://localhost:3000';
  } else {
    console.log('[Config] Using production URL (not set)');
    return 'https://your-production-api.com';
  }
};

export const Config = {
  API_BASE_URL: getApiUrl(),
  API_TIMEOUT: 30000,
  MESSAGES_PER_PAGE: 50,
  CONVERSATIONS_PER_PAGE: 20,
  MESSAGE_MAX_LENGTH: 2000,
  SCROLL_THRESHOLD: 100,
};
