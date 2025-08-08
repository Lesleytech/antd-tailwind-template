import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// The user-provided interfaces
interface IQueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

interface IAuthObject {
  accessToken: string;
  refreshToken: string;
}

interface IApiClientConfig {
  baseURL: string;
  getAuth?: () => IAuthObject | null;
  onUnauthorized?: VoidFunction;
  refreshTokenFn?: (auth: IAuthObject) => Promise<IAuthObject>;
  setAuthHeaders?: (config: AxiosRequestConfig, token: string) => void;
  onError?: (error: AxiosError<any>) => void;
  isUnauthorizedResponse?: (error: AxiosError<any>) => boolean;
  ignoreRefreshTokenForUrls?: (string | RegExp)[];
}

class ApiClient {
  private readonly api: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: IQueueItem[] = [];
  private readonly config: IApiClientConfig;

  constructor(config: IApiClientConfig) {
    this.config = config;

    this.api = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((reqConfig) => {
      const auth = this.config.getAuth?.();

      if (auth?.accessToken) {
        if (this.config.setAuthHeaders) {
          this.config.setAuthHeaders(reqConfig, auth.accessToken);
        } else if (reqConfig.headers) {
          reqConfig.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
      }

      return reqConfig;
    });

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => this.handleError(error),
    );
  }

  // --- Utility Methods ---
  private processQueue(error: Error | null, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private isIgnoredUrl(url: string): boolean {
    if (!this.config.ignoreRefreshTokenForUrls) {
      return false;
    }

    return this.config.ignoreRefreshTokenForUrls.some((ignored) => {
      if (typeof ignored === 'string') {
        return url.includes(ignored);
      }
      return ignored.test(url);
    });
  }

  private async handleError(error: AxiosError): Promise<AxiosResponse | AxiosError> {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retryCount?: number;
    };
    const url = originalRequest.url || '';
    const auth = this.config.getAuth?.();

    // Initialize the retry count if it doesn't exist
    if (typeof originalRequest._retryCount === 'undefined') {
      originalRequest._retryCount = 0;
    }

    // Determine if the error is an unauthorized response using the custom function or a default check
    const isUnauthorized = this.config.isUnauthorizedResponse
      ? this.config.isUnauthorizedResponse(error)
      : error.response?.status === 401;

    // Check if the URL should be ignored
    if (this.isIgnoredUrl(url) || !isUnauthorized || originalRequest._retryCount >= 1) {
      this.config.onError?.(error);

      return Promise.reject(error);
    }

    // Increment the retry count
    originalRequest._retryCount++;

    // Token refresh logic (only if the error is unauthorized and the URL is not ignored)
    if (this.config.refreshTokenFn && auth?.refreshToken) {
      if (this.isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (this.config.setAuthHeaders) {
              this.config.setAuthHeaders(originalRequest, token);
            } else if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }

            return this.api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      this.isRefreshing = true;

      try {
        const { accessToken } = await this.config.refreshTokenFn(auth);

        if (this.config.setAuthHeaders) {
          this.config.setAuthHeaders(originalRequest, accessToken);
        } else if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        this.processQueue(null, accessToken);

        return this.api(originalRequest);
      } catch (refreshError) {
        this.config.onUnauthorized?.();
        this.processQueue(refreshError as Error, null);

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    } else {
      // If no refresh function is provided, just call the onUnauthorized handler
      this.config.onUnauthorized?.();
      return Promise.reject(error);
    }
  }

  // --- CRUD Operations ---
  get<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, requestConfig);
  }

  post<T>(url: string, data?: any, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, requestConfig);
  }

  put<T>(url: string, data?: any, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, requestConfig);
  }

  delete<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, requestConfig);
  }

  patch<T>(url: string, data?: any, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, requestConfig);
  }
}

export { ApiClient };
