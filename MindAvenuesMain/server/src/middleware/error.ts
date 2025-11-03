//src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';

class ErrorHandler extends Error {
  statusCode: number;
  errors?: any;
  path?: string;
  keyValue?: any;
  code?: number;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ErrorHandler {
  constructor(message: string, errors?: any) {
    super(message, 400, errors);
  }
}

class NotFoundError extends ErrorHandler {
  constructor(message: string) {
    super(message, 404);
  }
}

class UnauthorizedError extends ErrorHandler {
  constructor(message: string) {
    super(message, 401);
  }
}

class ForbiddenError extends ErrorHandler {
  constructor(message: string) {
    super(message, 403);
  }
}

const errorMiddleware = (
  err: ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message,
    errors: err.errors || undefined,
    stack: isDev ? err.stack : undefined,
  });
};

export { ErrorHandler, BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError };
export default errorMiddleware;