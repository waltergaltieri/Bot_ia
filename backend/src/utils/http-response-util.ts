import { logger } from "./logger";

// Types for better type safety
interface ApiResponse<T = any> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

interface ErrorResponse {
  error: string;
  message?: string | undefined;
  details?: any;
  timestamp?: string;
  path?: string | undefined;
}

interface SuccessResponse<T = any> {
  data: T;
  message?: string | undefined;
  timestamp?: string;
}

// Helper function to create standardized responses
function createResponse<T>(status: number, body: T, headers?: Record<string, string>): ApiResponse<T> {
  return {
    status,
    body,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
}

// Helper function to create error responses
function createErrorResponse(status: number, error: string, message?: string, details?: any, path?: string): ApiResponse<ErrorResponse> {
  return createResponse(status, {
    error,
    message,
    details,
    timestamp: new Date().toISOString(),
    path,
  });
}

// Helper function to create success responses
function createSuccessResponse<T>(status: number, data: T, message?: string): ApiResponse<SuccessResponse<T>> {
  return createResponse(status, {
    data,
    message,
    timestamp: new Date().toISOString(),
  });
}

// ================================
// SUCCESS RESPONSES (2xx)
// ================================

export function ok<T>(data: T, message?: string): ApiResponse<SuccessResponse<T>> {
  return createSuccessResponse(200, data, message);
}

export function created<T>(data: T, message?: string): ApiResponse<SuccessResponse<T>> {
  return createSuccessResponse(201, data, message || "Resource created successfully");
}

export function accepted<T>(data: T, message?: string): ApiResponse<SuccessResponse<T>> {
  return createSuccessResponse(202, data, message || "Request accepted for processing");
}

export function noContent(): ApiResponse<null> {
  return createResponse(204, null);
}

// ================================
// CLIENT ERROR RESPONSES (4xx)
// ================================

export function badRequest(message: string = "Bad Request", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Bad Request:", message, details);
  return createErrorResponse(400, "Bad Request", message, details, path);
}

export function unauthorized(message: string = "Authentication required", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Unauthorized access attempt:", message, details);
  return createErrorResponse(401, "Unauthorized", message, details, path);
}

export function forbidden(message: string = "Access forbidden", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Forbidden access attempt:", message, details);
  return createErrorResponse(403, "Forbidden", message, details, path);
}

export function notFound(message: string = "Resource not found", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Resource not found:", message, details);
  return createErrorResponse(404, "Not Found", message, details, path);
}

export function methodNotAllowed(message: string = "Method not allowed", allowedMethods?: string[], path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Method not allowed:", message, allowedMethods);
  const response = createErrorResponse(405, "Method Not Allowed", message, allowedMethods, path);
  if (allowedMethods) {
    response.headers!["Allow"] = allowedMethods.join(", ");
  }
  return response;
}

export function conflict(message: string = "Resource conflict", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Resource conflict:", message, details);
  return createErrorResponse(409, "Conflict", message, details, path);
}

export function unprocessableEntity(message: string = "Validation failed", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Validation error:", message, details);
  return createErrorResponse(422, "Unprocessable Entity", message, details, path);
}

export function tooManyRequests(message: string = "Too many requests", retryAfter?: number, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Rate limit exceeded:", message, { retryAfter });
  const response = createErrorResponse(429, "Too Many Requests", message, { retryAfter }, path);
  if (retryAfter) {
    response.headers!["Retry-After"] = retryAfter.toString();
  }
  return response;
}

// ================================
// SERVER ERROR RESPONSES (5xx)
// ================================

export function internalServerError(message: string = "An unexpected error occurred", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.error("Internal Server Error:", message, details);
  // In production, you might want to sanitize details to avoid exposing sensitive information
  const sanitizedDetails = process.env.NODE_ENV === "production" ? undefined : details;
  return createErrorResponse(500, "Internal Server Error", message, sanitizedDetails, path);
}

export function notImplemented(message: string = "Feature not implemented", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.warn("Not implemented:", message, details);
  return createErrorResponse(501, "Not Implemented", message, details, path);
}

export function badGateway(message: string = "Bad gateway", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.error("Bad Gateway:", message, details);
  return createErrorResponse(502, "Bad Gateway", message, details, path);
}

export function serviceUnavailable(message: string = "Service temporarily unavailable", retryAfter?: number, path?: string): ApiResponse<ErrorResponse> {
  logger.error("Service Unavailable:", message, { retryAfter });
  const response = createErrorResponse(503, "Service Unavailable", message, { retryAfter }, path);
  if (retryAfter) {
    response.headers!["Retry-After"] = retryAfter.toString();
  }
  return response;
}

export function gatewayTimeout(message: string = "Gateway timeout", details?: any, path?: string): ApiResponse<ErrorResponse> {
  logger.error("Gateway Timeout:", message, details);
  return createErrorResponse(504, "Gateway Timeout", message, details, path);
}

// ================================
// UTILITY FUNCTIONS
// ================================

export function customResponse<T>(status: number, body: T, headers?: Record<string, string>): ApiResponse<T> {
  return createResponse(status, body, headers);
}

export function isErrorResponse(response: ApiResponse): response is ApiResponse<ErrorResponse> {
  return response.status >= 400;
}

export function isSuccessResponse(response: ApiResponse): response is ApiResponse<SuccessResponse> {
  return response.status >= 200 && response.status < 300;
}

// ================================
// EXPRESS.JS RESPONSE FUNCTIONS
// ================================

// Type for Express response (you can import this from express if available)
interface ExpressResponse {
  status(code: number): ExpressResponse;
  json(body: any): ExpressResponse;
  set(field: string, value: string): ExpressResponse;
  set(headers: Record<string, string>): ExpressResponse;
}

// Helper function to send Express response
function sendExpressResponse<T>(res: ExpressResponse, apiResponse: ApiResponse<T>): ExpressResponse {
  if (apiResponse.headers) {
    res.set(apiResponse.headers);
  }
  return res.status(apiResponse.status).json(apiResponse.body);
}

// ================================
// EXPRESS SUCCESS RESPONSES
// ================================

export function sendOk<T>(res: ExpressResponse, data: T, message?: string): ExpressResponse {
  return sendExpressResponse(res, ok(data, message));
}

export function sendCreated<T>(res: ExpressResponse, data: T, message?: string): ExpressResponse {
  return sendExpressResponse(res, created(data, message));
}

export function sendAccepted<T>(res: ExpressResponse, data: T, message?: string): ExpressResponse {
  return sendExpressResponse(res, accepted(data, message));
}

export function sendNoContent(res: ExpressResponse): ExpressResponse {
  return sendExpressResponse(res, noContent());
}

// ================================
// EXPRESS ERROR RESPONSES
// ================================

export function sendBadRequest(res: ExpressResponse, message: string = "Bad Request", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, badRequest(message, details, path));
}

export function sendUnauthorized(res: ExpressResponse, message: string = "Authentication required", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, unauthorized(message, details, path));
}

export function sendForbidden(res: ExpressResponse, message: string = "Access forbidden", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, forbidden(message, details, path));
}

export function sendNotFound(res: ExpressResponse, message: string = "Resource not found", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, notFound(message, details, path));
}

export function sendMethodNotAllowed(res: ExpressResponse, message: string = "Method not allowed", allowedMethods?: string[], path?: string): ExpressResponse {
  return sendExpressResponse(res, methodNotAllowed(message, allowedMethods, path));
}

export function sendConflict(res: ExpressResponse, message: string = "Resource conflict", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, conflict(message, details, path));
}

export function sendUnprocessableEntity(res: ExpressResponse, message: string = "Validation failed", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, unprocessableEntity(message, details, path));
}

export function sendTooManyRequests(res: ExpressResponse, message: string = "Too many requests", retryAfter?: number, path?: string): ExpressResponse {
  return sendExpressResponse(res, tooManyRequests(message, retryAfter, path));
}

export function sendInternalServerError(res: ExpressResponse, message: string = "An unexpected error occurred", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, internalServerError(message, details, path));
}

export function sendNotImplemented(res: ExpressResponse, message: string = "Feature not implemented", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, notImplemented(message, details, path));
}

export function sendBadGateway(res: ExpressResponse, message: string = "Bad gateway", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, badGateway(message, details, path));
}

export function sendServiceUnavailable(
  res: ExpressResponse,
  message: string = "Service temporarily unavailable",
  retryAfter?: number,
  path?: string
): ExpressResponse {
  return sendExpressResponse(res, serviceUnavailable(message, retryAfter, path));
}

export function sendGatewayTimeout(res: ExpressResponse, message: string = "Gateway timeout", details?: any, path?: string): ExpressResponse {
  return sendExpressResponse(res, gatewayTimeout(message, details, path));
}

// ================================
// EXPRESS UTILITY FUNCTIONS
// ================================

export function sendCustomResponse<T>(res: ExpressResponse, status: number, body: T, headers?: Record<string, string>): ExpressResponse {
  return sendExpressResponse(res, customResponse(status, body, headers));
}

// Generic error handler that matches your pattern
export function sendErrorResponse(res: ExpressResponse, status: number, message: string, error: unknown): ExpressResponse {
  const errorMessage = error instanceof Error ? error.message : "Error desconocido";

  return res.status(status).json({
    message,
    error: errorMessage,
  });
}

// ================================
// EXAMPLE USAGE
// ================================

/*
// Using the new Express functions:

// Success responses
sendOk(res, { id: 1, name: 'John Doe' }, 'User retrieved successfully');
sendCreated(res, { id: 2, name: 'Jane Doe' });
sendNoContent(res);

// Error responses
sendBadRequest(res, 'Invalid email format', { field: 'email' });
sendUnauthorized(res, 'Invalid token');
sendNotFound(res, 'User not found', { userId: 123 });
sendInternalServerError(res, 'Database connection failed', { error: 'ECONNREFUSED' });

// Your specific LinkedIn auth error example:
sendLinkedInAuthError(res, error);
// or with custom message:
sendLinkedInAuthError(res, error, "Custom LinkedIn error message");

// Generic error with your exact pattern:
sendErrorResponse(res, 500, "Error durante la autenticación de LinkedIn", error);

// Original functions still available for non-Express usage:
const userResponse = ok({ id: 1, name: 'John Doe' }, 'User retrieved successfully');
const validation = badRequest('Invalid email format', { field: 'email' });
*/
