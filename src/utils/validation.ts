import { ValidationError } from "./error";

export function validateString(data: unknown) {
  if (data === undefined) {
    throw new ValidationError("RequestKeyMissingException");
  }
  if (typeof data === "string") return data;
  throw new ValidationError("RequestTypeInvalidException");
}
