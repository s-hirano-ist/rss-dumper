import type { Response } from "express";
import { NewsController } from "../controllers/newsController";

// for info, warning, error responses
export function sendInfoResponse2(
  controller: NewsController,
  status: number,
  message: string,
  consoleOnlyError: unknown = undefined,
) {
  if (status === 200 || status === 201) {
    controller.setStatus(status);
    return { message: message };
  } else {
    controller.setStatus(status);
    /* istanbul ignore next */
    if (consoleOnlyError) console.error("ERROR", consoleOnlyError);
    else {
      if (process.env.NODE_ENV !== "test") console.error("ERROR:", message);
    }
    return { message: "ERROR: " + message };
  }
}

export function sendInfoResponse(
  response: Response,
  status: number,
  message: string,
  consoleOnlyError: unknown = undefined,
) {
  if (status === 200 || status === 201) {
    response.status(status).json({
      message: message,
    });
  } else {
    response.status(status).json({
      message: "ERROR: " + message,
    });
    /* istanbul ignore next */
    if (consoleOnlyError) console.error("ERROR", consoleOnlyError);
    else {
      if (process.env.NODE_ENV !== "test") console.error("ERROR:", message);
    }
  }
}
