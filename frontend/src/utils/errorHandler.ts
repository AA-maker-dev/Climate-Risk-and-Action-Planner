import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      detail?: string;
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    const statusCode = axiosError.response?.status || 500;
    const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.detail ||
      axiosError.message ||
      'An error occurred';

    const apiError = new ApiError(
      statusCode,
      message,
      axiosError.response?.data?.errors
    );

    // Show error toast based on status code
    switch (statusCode) {
      case 400:
        toast.error('Invalid request. Please check your input.');
        break;
      case 401:
        toast.error('Authentication failed. Please log in again.');
        break;
      case 403:
        toast.error('Access denied.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }

    return apiError;
  }

  const error = new ApiError(500, 'An unexpected error occurred');
  toast.error(error.message);
  return error;
};

export const retryApiCall = async <T,>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on 4xx errors
      if (axios.isAxiosError(error) && error.response?.status?.toString().startsWith('4')) {
        throw handleApiError(error);
      }

      // Wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }

  if (lastError) {
    throw handleApiError(lastError);
  }

  throw new ApiError(500, 'Failed after multiple retries');
};
