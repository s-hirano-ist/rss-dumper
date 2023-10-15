import { Prisma } from "@prisma/client";
import type { Response } from "express";
import { NewsController } from "../controllers/newsController";
import { sendInfoResponse, sendInfoResponse2 } from "./response";

export function prismaError2(
  controller: NewsController,
  error: Prisma.PrismaClientKnownRequestError,
) {
  switch (error.code) {
    case "P2002":
      // "Unique constraint failed on the {constraint}"
      return sendInfoResponse2(controller, 400, "Duplicate Entry");
    case "P2025":
      // "An operation failed because it depends on one or more records that were required but not found. {cause}"
      return sendInfoResponse2(controller, 404, "Not found");
    default: // should not run
      /* istanbul ignore next */
      return sendInfoResponse2(
        controller,
        500,
        "INTERNAL SERVER ERROR",
        "onPrismaError",
      );
  }
}

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
      /* istanbul ignore next */
      sendInfoResponse(response, 500, "INTERNAL SERVER ERROR", "onPrismaError");
      /* istanbul ignore next */
      break;
  }
}
export function validationError(response: Response, message: string) {
  sendInfoResponse(response, 422, message);
}

/* istanbul ignore next */
export function unknownError2(controller: NewsController, error: unknown) {
  // should not run
  if (error instanceof Error) {
    sendInfoResponse2(controller, 500, "INTERNAL SERVER ERROR", error.message);
  } else {
    sendInfoResponse2(controller, 500, "INTERNAL SERVER ERROR", error);
  }
}

/* istanbul ignore next */
export function unknownError(response: Response, error: unknown) {
  // should not run
  if (error instanceof Error) {
    sendInfoResponse(response, 500, "INTERNAL SERVER ERROR", error.message);
  } else {
    sendInfoResponse(response, 500, "INTERNAL SERVER ERROR", error);
  }
}
