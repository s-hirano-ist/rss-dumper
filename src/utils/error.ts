import { Prisma } from "@prisma/client";
import type { Response } from "express";

export function prismaError(
  response: Response,
  error: Prisma.PrismaClientKnownRequestError,
) {
  switch (error.code) {
    case "P2002":
      // "Unique constraint failed on the {constraint}"
      response.status(400).json({
        message: "ERROR: Duplicate Entry",
      });
      console.error("ERROR: Duplicate Entry");
      break;
    case "P2025":
      // "An operation failed because it depends on one or more records that were required but not found. {cause}"
      response.status(400).json({
        message: "ERROR: Not found",
      });
      console.error("ERROR: Not found");
      break;
    default:
      response.status(500).json({
        message: "Internal server error",
      });
      console.error("INTERNAL SERVER ERROR:", error.message);
      break;
  }
}
export function validationError(response: Response, message: string) {
  response.status(400).json({
    message: message,
  });
  console.error(message);
}
export function notFoundError(response: Response) {
  response.status(400).json({
    message: "ERROR: Not found",
  });
  console.error("ERROR: Not found");
}
export function unknownError(response: Response, error: unknown) {
  if (error instanceof Error) {
    response.status(500).json({
      message: "ERROR: Internal server error",
    });
    console.error("ERROR: UNKNOWN: ", error.message);
  } else {
    response.status(500).json({
      message: "ERROR: Internal server error",
    });
    console.error("ERROR: UNKNOWN: ", error);
  }
}

export class ValidationError extends Error {
  constructor(message: MessageType) {
    super(message);
    switch (message) {
      case "RequestTypeInvalidException":
        this.name = "ERROR: Invalid request type";
        break;
      case "RequestKeyMissingException":
        this.name = "ERROR: Invalid request key";
        break;
      default:
        this.name = "ERROR: Unknown error";
        break;
    }
  }
}
type MessageType = "RequestTypeInvalidException" | "RequestKeyMissingException";
