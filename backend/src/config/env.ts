import dotenv from 'dotenv';
import { ApiError } from '../types/domain';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  supabase: {
    url: string;
    serviceRoleKey: string;
  };
  gemini: {
    apiKey: string;
    modelId: string;
  };
  jwt: {
    secret: string;
  };
  logLevel: string;
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new ApiError(500, `Missing required environment variable: ${key}`, 'CONFIG_ERROR');
  }
  return value;
}

function validateConfig(): Config {
  return {
    port: parseInt(getEnvVariable('PORT', '3000'), 10),
    nodeEnv: getEnvVariable('NODE_ENV', 'development'),
    supabase: {
      url: getEnvVariable('SUPABASE_URL'),
      serviceRoleKey: getEnvVariable('SUPABASE_SERVICE_ROLE_KEY'),
    },
    gemini: {
      apiKey: getEnvVariable('GEMINI_API_KEY'),
      modelId: getEnvVariable('GEMINI_MODEL_ID', 'gemini-1.5-pro'),
    },
    jwt: {
      secret: getEnvVariable('JWT_SECRET', 'dev-secret-key'),
    },
    logLevel: getEnvVariable('LOG_LEVEL', 'info'),
  };
}

export const config = validateConfig();
