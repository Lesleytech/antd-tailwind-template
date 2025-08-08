const envVars = {
  API_EP: (import.meta.env.VITE_APP_API_EP as string).replace(/\/$/, ''),
  LANDING_PAGE: (import.meta.env.VITE_APP_LANDING_PAGE as string).replace(/\/$/, ''),
  NEW_RELIC_CONFIG: import.meta.env.VITE_APP_NEW_RELIC_CONFIG as string,
  APP_CONFIG: import.meta.env.VITE_APP_APP_CONFIG as string,
  POSTHOG_KEY: import.meta.env.VITE_APP_POSTHOG_KEY as string,
  POSTHOG_HOST: import.meta.env.VITE_APP_POSTHOG_HOST as string,
};

type TEnvVars = typeof envVars;

export class ConfigService {
  static get<T extends keyof TEnvVars>(key: T): TEnvVars[T] {
    return envVars[key];
  }

  static getAll() {
    return envVars;
  }
}
