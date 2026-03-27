// Standardized API response structure from the backend.
export interface BaseResponse<T = any> {
  // Indicates if the request was successful.
  success: boolean;

  // Represents the error, if any. Null on success.
  errorCode: string | null;

  // The raw message key for localization. Null on success.
  messageKey: string | null;

  // The resolved, human-readable message.
  message: string;

  // Additional error parameters (e.g., validation failures). Null on success.
  params: Record<string, any> | null;

  // The actual data payload. Null on failure.
  data: T;

  // The server timestamp (ISO 8601 format).
  timestamp: string;
}
