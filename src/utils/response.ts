import type { Response } from "express";

// for info, warning, error responses
export function sendInfoResponse(
  response: Response,
  status: number,
  message: string,
  consoleOnlyError: unknown = undefined,
) {
  if (status === 200 || status === 201) {
    response.status(200).json({
      message: message,
    });
  } else {
    response.status(status).json({
      message: "ERROR: " + message,
    });
    if (consoleOnlyError) console.error("ERROR", consoleOnlyError);
    else console.error("ERROR:", message);
  }
}
