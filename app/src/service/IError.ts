export interface ErrorResponse {
  success: boolean;
  message: string;
  code?: string;
  details?: string;
}
