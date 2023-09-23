import { Prisma } from "@prisma/client";
import type { Response } from "express";
import { sendInfoResponse } from "./response";

export function prismaError(
  response: Response,
  error: Prisma.PrismaClientKnownRequestError,
) {
  switch (error.code) {
    case "P2002":
      // "Unique constraint failed on the {constraint}"
      sendInfoResponse(response, 400, "Duplicate Entry");
      break;
    case "P2025":
      // "An operation failed because it depends on one or more records that were required but not found. {cause}"
      sendInfoResponse(response, 404, "Not found");
      break;
    default: // should not run
      sendInfoResponse(response, 500, "INTERNAL SERVER ERROR", "onPrismaError");
      break;
  }
}
export function validationError(response: Response, message: string) {
  sendInfoResponse(response, 400, message);
}

export function notFoundError(response: Response) {
  sendInfoResponse(response, 404, "Not found");
}

export function unknownError(response: Response, error: unknown) {
  // should not run
  if (error instanceof Error) {
    sendInfoResponse(response, 500, "INTERNAL SERVER ERROR", error.message);
  } else {
    sendInfoResponse(response, 500, "INTERNAL SERVER ERROR", error);
  }
}

export class ValidationError extends Error {
  constructor(message: MessageType) {
    super(message);
    switch (message) {
      case "RequestTypeInvalidException":
        this.name = "Invalid request type";
        break;
      case "RequestKeyMissingException":
        this.name = "Invalid request key";
        break;
      default: // should not run
        this.name = "Unknown error";
        break;
    }
  }
}
type MessageType = "RequestTypeInvalidException" | "RequestKeyMissingException";
