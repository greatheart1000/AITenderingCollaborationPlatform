export interface ApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient({baseUrl, fetchImpl = fetch}: ApiClientOptions) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');

  async function get<T>(path: string): Promise<T> {
    const response = await fetchImpl(`${normalizedBaseUrl}${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const body = (await response.json()) as {message?: string};
        if (body?.message) {
          message = body.message;
        }
      } catch {
        // ignore invalid JSON error bodies
      }
      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  }

  return {get};
}

