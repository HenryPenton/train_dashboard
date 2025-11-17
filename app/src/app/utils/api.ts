import { APP_CONSTANTS } from '../constants/app';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(
        `${APP_CONSTANTS.ERROR_MESSAGES.FETCH_FAILED}: ${response.status}`,
        response.status,
        url
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(APP_CONSTANTS.ERROR_MESSAGES.UNKNOWN_ERROR, undefined, url);
  }
}

export function createApiUrl(template: string, ...params: string[]): string {
  return template.replace(/\[(\w+)\]/g, (_, key) => {
    const index = parseInt(key) || 0;
    return params[index] || '';
  });
}