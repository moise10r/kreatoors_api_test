import { AppError } from "../../common/error/error";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
    });
  } else {
    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};
